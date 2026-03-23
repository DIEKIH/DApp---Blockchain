# Auction DApp

Repo nay da duoc tach thanh 2 phan ro rang:

- `root`: frontend React + Supabase
- `blockchain/`: smart contract + Hardhat

## Frontend

Chay frontend tai root:

```bash
npm install
npm start
```

Build frontend:

```bash
npm run build
```

## Blockchain

Toan bo file contract nam trong `blockchain/`:

- `blockchain/contracts`
- `blockchain/test`
- `blockchain/ignition`
- `blockchain/hardhat.config.js`

Cai dependency rieng cho blockchain:

```bash
cd blockchain
npm install --legacy-peer-deps
```

Compile contract:

```bash
npm run compile
```

Chay test:

```bash
npm run test
```

Deploy module mau:

```bash
npm run deploy:local
```

Deploy Sepolia:

```bash
npm run deploy:sepolia
```

## Ghi chu

- Root `package.json` chi con dependency frontend, khong tron voi Hardhat nua.
- `blockchain/package.json` giu toan bo dependency cua Hardhat.
- Neu editor van cache loi cu, reload TypeScript server / window la du.
