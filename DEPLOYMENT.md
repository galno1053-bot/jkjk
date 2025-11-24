# Deployment Guide - NadzMultiSend

## Langkah-langkah Deployment

### 1. Deploy Contract ke Monad Mainnet

#### Option A: Menggunakan Remix IDE (Recommended untuk pemula)

1. Buka [Remix IDE](https://remix.ethereum.org/)
2. Buat file baru: `NadzMultiSend.sol`
3. Copy-paste seluruh isi dari `remix-contracts/NadzMultiSend.sol`
4. Compile contract:
   - Pilih compiler version: `0.8.20` atau lebih baru
   - Klik "Compile NadzMultiSend.sol"
5. Deploy contract:
   - Pilih tab "Deploy & Run Transactions"
   - Environment: Pilih "Injected Provider - MetaMask" (pastikan wallet terhubung ke Monad Mainnet / Monad Chain)
   - Deploy Constructor:
     - `_feeRecipient`: Masukkan alamat wallet yang akan menerima fee (contoh: `0x...`)
     - `_feeAmount`: Masukkan jumlah fee dalam wei (contoh: `50000000000000000000` untuk 50 MON)
   - Klik "Deploy"
   - Copy address contract yang baru di-deploy

#### Option B: Menggunakan Hardhat

1. Install dependencies (jika belum):
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. Setup hardhat.config.js:
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    "monad-mainnet": {
      url: "https://rpc.monad.xyz",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

3. Deploy:
```bash
FEE_RECIPIENT=0x... FEE_AMOUNT=50000000000000000000 npx hardhat run scripts/deploy-nadz-multisend.js --network monad-mainnet
```

### 2. Setup Environment Variable

1. Buat file `.env.local` di root project (jika belum ada)
2. Tambahkan variabel berikut:

```env
NEXT_PUBLIC_MULTISEND=0x...your_contract_address_here...
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_EXPLORER=https://monadscan.com
```

3. Restart development server:
```bash
npm run dev
```

### 3. Verifikasi Contract (Optional tapi Recommended)

1. Buka [MonadScan](https://monadscan.com)
2. Cari contract address yang sudah di-deploy
3. Verifikasi contract dengan upload source code
4. Verifikasi ABI (sudah tersedia di `src/lib/abis/multiSend.json`)

### 4. Testing Multi-Send

1. Pastikan wallet terhubung ke Monad Mainnet (Chain ID 143)
2. Pastikan wallet memiliki cukup MON untuk:
   - Fee multi-send (50 MON default)
   - Jumlah yang akan di-send ke recipients
3. Test dengan native token (MON):
   - Pilih "Native Token (MON)"
   - Tambahkan beberapa recipient
   - Isi jumlah yang akan di-send
   - Klik "Send"
4. Test dengan ERC20 token:
   - Pilih "Token"
   - Masukkan token address
   - Klik "Approve Tokens" terlebih dahulu
   - Tambahkan recipients
   - Klik "Send"

## Konfigurasi Fee

Default fee: 50 MON (50000000000000000000 wei)

Untuk mengubah fee setelah deployment (hanya owner):
```javascript
// Di Remix atau ethers.js
await contract.setFeeAmount("100000000000000000000"); // 100 MON
```

## Troubleshooting

### Error: "Multi-Send Contract Not Configured"
- Pastikan `NEXT_PUBLIC_MULTISEND` sudah di-set di `.env.local`
- Restart development server setelah menambah environment variable

### Error: "Insufficient value"
- Pastikan wallet memiliki cukup MON untuk fee + total amount yang akan di-send

### Error: "Transfer from failed" (untuk ERC20)
- Pastikan sudah approve token sebelum multi-send
- Pastikan allowance cukup untuk jumlah yang akan di-send

### Contract tidak muncul di explorer
- Tunggu beberapa saat untuk sync
- Refresh browser
- Cek apakah transaction deployment sudah confirmed

