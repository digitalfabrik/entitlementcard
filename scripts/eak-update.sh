#/ this file is located on the server to install newly deployed packages and hold/unhold packages from getting auto installed by weekly routine
#/ location: var/cache/salt/minion/files/base/entitlementcard/files/
#/bin/bash
sudo apt-mark unhold eak-backend eak-martin eak-administration eak
apt update
apt upgrade -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" eak
systemctl daemon-reload
systemctl restart eak-backend
systemctl restart eak-martin
sudo apt-mark hold eak-backend eak-martin eak-administration eak