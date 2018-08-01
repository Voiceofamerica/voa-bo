set -euo pipefail

echo "Building Android Local App"
NODE_ENV=development cordova build android -- --keystore="./build.keystore" --storePassword="$STORE_PASSWORD" --alias="voa-bo" --password="$ALIAS_PASSWORD" --target local
mv platforms/android/build/outputs/apk/debug/android-debug.apk platforms/android/build/outputs/apk/debug/android-local.apk

echo "Building Android Beta App"
NODE_ENV=test cordova build android -- --keystore="./build.keystore" --storePassword="$STORE_PASSWORD" --alias="voa-bo" --password="$ALIAS_PASSWORD" --target beta

echo "Building Android Prod App"
NODE_ENV=produection cordova build android --release -- --keystore="./build.keystore" --storePassword="$STORE_PASSWORD" --alias="voa-bo" --password="$ALIAS_PASSWORD" --target prod