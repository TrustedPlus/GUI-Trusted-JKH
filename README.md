## Install dependencies

```
> npm install -g typescript
> npm install

```

## Build for dev
⚠️ Before run dev need manualy add [TrustedPlus/crypto](https://github.com/TrustedPlus/crypto/) in /app/node_modules/ Will fixed in future
```bash
git clone https://github.com/TrustedPlus/gkh.git
cd esign && npm install
cd app && npm install
cd ..
npm run dev

# Run tslint
yarn lint
```

**NOTE:**
* on Windows need have OpenSSL [prebuild binaries](https://wiki.openssl.org/index.php/Binaries) or build from [sources](https://github.com/openssl/openssl/tree/OpenSSL_1_0_2k) in first time (for [TrustedPlus/crypto](https://github.com/TrustedPlus/crypto/blob/master/binding.gyp#L57))
* on Linux install openssl devel package
