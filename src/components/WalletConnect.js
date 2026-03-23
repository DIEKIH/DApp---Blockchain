// src/components/WalletConnect.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserProvider, formatEther } from 'ethers'; 
import detectEthereumProvider from '@metamask/detect-provider';

function WalletConnect({ onWalletConnected }) {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef(null);

  const ETH_NETWORKS = {
    '0x1': { name: 'Ethereum', color: '#627EEA' },
    '0xaa36a7': { name: 'Sepolia', color: '#CFADFF' },
    '0x4268': { name: 'Holešky', color: '#AA6DFF' },
    '0xa4b1': { name: 'Arbitrum', color: '#28A0F0' },
    '0xa': { name: 'Optimism', color: '#FF0420' },
    '0x2105': { name: 'Base', color: '#0052FF' },
    '0x539': { name: 'Localhost', color: '#F39C12' }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateWalletInfo = useCallback(async (newAccount, currentProvider) => {
    if (!newAccount || !currentProvider || !window.ethereum) {
      setAccount(null);
      setBalance(null);
      setChainId(null);
      if (onWalletConnected) onWalletConnected(null);
      return;
    }
    try {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const balanceBigInt = await currentProvider.getBalance(newAccount);
      setChainId(currentChainId);
      setAccount(newAccount);
      setBalance(formatEther(balanceBigInt));
      if (onWalletConnected) onWalletConnected({ account: newAccount, balance: formatEther(balanceBigInt), chainId: currentChainId });
    } catch (err) { console.error(err); }
  }, [onWalletConnected]);

  useEffect(() => {
    const init = async () => {
      const detectedProvider = await detectEthereumProvider();
      if (detectedProvider) {
        const browserProvider = new BrowserProvider(detectedProvider);
        setProvider(browserProvider);
        const accounts = await detectedProvider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) updateWalletInfo(accounts[0], browserProvider);
        detectedProvider.on('accountsChanged', (accs) => updateWalletInfo(accs[0], browserProvider));
        detectedProvider.on('chainChanged', () => window.location.reload());
      }
    };
    init();
  }, [updateWalletInfo]);

  const connectWallet = async () => {
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (provider) await updateWalletInfo(accounts[0], provider);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const net = ETH_NETWORKS[chainId] || { name: 'Unknown', color: '#6366f1' };

  if (!account) {
    return (
      <button onClick={connectWallet} disabled={loading} className="nav-connect-btn">
        {loading ? <span className="loader-dots">...</span> : "Connect Wallet"}
      </button>
    );
  }

  return (
    <div className="compact-wallet-container" ref={dropdownRef}>
      <div 
        className={`wallet-pill ${isExpanded ? 'active' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="pill-network-dot" style={{ backgroundColor: net.color }}></div>
        <span className="pill-address">{account.slice(0, 6)}...{account.slice(-4)}</span>
        <span className="pill-arrow">▼</span>
      </div>

      {isExpanded && (
        <div className="wallet-dropdown-panel">
          <div className="panel-header">
            <div className="status-indicator">
              <span className="pulse-dot"></span>
              Connected
            </div>
            <button className="panel-close" onClick={() => setIsExpanded(false)}>×</button>
          </div>

          <div className="panel-content">
            <div className="detail-item">
              <span className="detail-label">ACCOUNT</span>
              <div className="detail-value-row">
                <span className="detail-value">{account.slice(0, 10)}...{account.slice(-10)}</span>
                <button onClick={() => navigator.clipboard.writeText(account)} className="mini-copy-btn" title="Copy Address">📋</button>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-label">BALANCE</span>
              <div className="detail-value balance-large">
                {parseFloat(balance).toFixed(4)} <span className="eth-unit">ETH</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-label">NETWORK</span>
              <div className="detail-network-box">
                <div className="net-icon" style={{ backgroundColor: net.color }}></div>
                <span className="net-name">{net.name}</span>
              </div>
            </div>

            <button 
              onClick={() => { setAccount(null); setIsExpanded(false); }} 
              className="panel-disconnect-btn"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletConnect;
