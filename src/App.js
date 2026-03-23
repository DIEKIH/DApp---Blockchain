import React, { useState, useCallback, useEffect} from 'react';
import WalletConnect from './components/WalletConnect.js';
import { supabase } from './supabaseClient.js';

import './App.css';

function App() {
  const [walletInfo, setWalletInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('auctions').select('*').limit(1);
        
        if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
          console.error("❌ Kết nối Supabase thất bại:", error.message);
        } else {
          console.log("✅ Kết nối Supabase thành công!");
        }
      } catch (err) {
        console.error("❌ Lỗi hệ thống khi kết nối Supabase:", err.message);
      }
    };
    checkConnection();
  }, []);
  // Dữ liệu mẫu (Giả định lấy từ Blockchain)
  const [products, setProducts] = useState([
    {
      id: 1,
      title: "Cổ vật Đế chế Byzantine",
      description: "Một chiếc bình gốm cổ từ thế kỷ thứ 4, được tìm thấy tại di chỉ Constantinople.",
      startPrice: "0.5",
      currentBid: "1.2",
      endTime: "2026-03-20T10:00:00",
      seller: "0x123...abc",
      image: "https://images.unsplash.com/photo-1580136608260-42d1c4aa785f?q=80&w=500"
    },
    {
      id: 2,
      title: "Tác phẩm NFT 'Vũ trụ Số'",
      description: "Bản vẽ độc bản về sự hình thành của các thiên hà trong môi trường thực tế ảo.",
      startPrice: "2.0",
      currentBid: "2.5",
      endTime: "2026-03-18T15:30:00",
      seller: "0x456...def",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500"
    }
  ]);

  const handleWalletConnected = useCallback((info) => {
    setWalletInfo(info);
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newProduct = {
      id: products.length + 1,
      title: formData.get('title'),
      description: formData.get('description'),
      startPrice: formData.get('price'),
      currentBid: formData.get('price'),
      endTime: new Date(Date.now() + 86400000).toISOString(), // Mặc định 24h
      seller: walletInfo?.account || "Ẩn danh",
      image: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=500"
    };
    setProducts([newProduct, ...products]);
    setIsModalOpen(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <button 
            className="action-btn-primary" 
            onClick={() => setIsModalOpen(true)}
            disabled={!walletInfo}
          >
            <span>➕</span> Tạo Đấu Giá
          </button>
        </div>
        <div className="header-center">
          <h1>🏛️ Auction DApp</h1>
          <p className="subtitle">Sàn đấu giá phi tập trung minh bạch</p>
        </div>
        <div className="header-right">
          <WalletConnect onWalletConnected={handleWalletConnected} />
        </div>
      </header>

      <main className="app-main">
        {!walletInfo ? (
          <div className="hero-section">
            <h2>Chào mừng bạn đến với thế giới Đấu giá Web3</h2>
            <p>Vui lòng kết nối ví MetaMask ở góc trên bên phải để bắt đầu tham gia sàn đấu giá.</p>
          </div>
        ) : (
          <div className="auction-container">
            <div className="section-header">
              <h2>⚡ Đang diễn ra ({products.length})</h2>
              <div className="filter-tabs">
                <span className="tab active">Tất cả</span>
                <span className="tab">Gần kết thúc</span>
                <span className="tab">Giá thấp nhất</span>
              </div>
            </div>

            <div className="product-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image" style={{ backgroundImage: `url(${product.image})` }}>
                    <div className="time-badge">23h : 15m : 04s</div>
                  </div>
                  <div className="product-info">
                    <h3>{product.title}</h3>
                    <p className="desc">{product.description}</p>
                    <div className="bid-info">
                      <div className="bid-item">
                        <span className="bid-label">Giá khởi điểm</span>
                        <span className="bid-value">{product.startPrice} ETH</span>
                      </div>
                      <div className="bid-item high">
                        <span className="bid-label">Giá hiện tại</span>
                        <span className="bid-value">{product.currentBid} ETH</span>
                      </div>
                    </div>
                    <button className="bid-btn">Đặt Giá Ngay</button>
                    <div className="seller-info">Người bán: {product.seller}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal Đăng Sản Phẩm */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>📋 Đăng Sản Phẩm Mới</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleAddProduct} className="auction-form">
              <div className="input-group">
                <label>Tên sản phẩm</label>
                <input name="title" required placeholder="Ví dụ: Bức tranh Mona Lisa số hóa" />
              </div>
              <div className="input-group">
                <label>Mô tả chi tiết</label>
                <textarea name="description" required placeholder="Nhập câu chuyện về sản phẩm của bạn..." rows="4"></textarea>
              </div>
              <div className="input-group">
                <label>Giá khởi điểm (ETH)</label>
                <input name="price" type="number" step="0.01" required placeholder="0.1" />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-submit">🚀 Đăng Đấu Giá</button>
              </div>
              <p className="form-hint">Lưu ý: Mọi giao dịch đều được ghi lại trên Blockchain.</p>
            </form>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>© 2026 Auction DApp - Được vận hành bởi Smart Contract</p>
      </footer>
    </div>
  );
}

export default App;
