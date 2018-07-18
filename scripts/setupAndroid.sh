set -euo pipefail

echo "Checking if unzip is installed"
which unzip
if [[ $? != 0 ]]
then
  echo "Installing unzip"
  apt install unzip
else
  echo "Found unzip"
fi
