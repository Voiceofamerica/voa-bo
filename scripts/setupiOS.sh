set -euo pipefail

brew install ldid

export THEOS=~/theos

if grep -q "export THEOS=~/theos" "~/.bash_profile"
then
  echo "export THEOS=~/theos" >> ~/.bash_profile
  echo "export PATH=\$THEOS/bin:\$PATH" >> ~/.bash_profile
fi

echo "Installing Theos prerequisites"
brew install perl ldid
cpan IO::Compress::Lzma

echo "Cloning Theos..."
git clone --recursive https://github.com/theos/theos.git $THEOS
export PATH=$THEOS/bin:$PATH
echo "Theos added to PATH"
