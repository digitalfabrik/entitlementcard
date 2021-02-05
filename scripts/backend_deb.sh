#!/bin/bash
set -eo pipefail

# deb constants
version=1.0
revision=1
name=eak-backend
architecture=amd64
maintainer="The Ehrenamtskarte Team <info@ehrenamtskarte.app>"
description="Backend server for the Ehrenamtskarte app"
dependencies="default-jre"

# read input
while getopts v:r:a:n:t:s:h flag
do
    case "${flag}" in
        v) version=${OPTARG};;
        r) revision=${OPTARG};;
        a) architecture=${OPTARG};;
        n) name=${OPTARG};;
        t) tarfile=${OPTARG};;
        s) servicefile=${OPTARG};;
        h) 
            echo "$0 [-v version] [-r revision] [-a architecture] [-n name] [-t backend_tar] [-s service_file]"
            exit 0;;
        *)
            echo "Unknown flag"
            exit 1;;
    esac
done

debworkdir=$(mktemp -d)
fullname=${name}_${version}-${revision}_${architecture}
debfile=${fullname}.deb

# init deb workdir
mkdir "${debworkdir}/DEBIAN"
ctrlfile=${debworkdir}/DEBIAN/control
echo "Creating control file in $ctrlfile …"
touch "$ctrlfile"
echo "Package: $name" >> "$ctrlfile"
echo "Version: $version" >> "$ctrlfile"
echo "Architecture: $architecture" >> "$ctrlfile"
echo "Maintainer: $maintainer" >> "$ctrlfile"
echo "Description: $description" >> "$ctrlfile"
echo "Depends: $dependencies" >> "$ctrlfile"

# copy files to deb workdir
if [[ -n "$tarfile" ]]; then
    echo "Copying $tarfile …"
    mkdir -p "${debworkdir}/opt/ehrenamtskarte/backend"
    tar -xf "$tarfile" -C "${debworkdir}/opt/ehrenamtskarte"
fi
if [[ -n "$servicefile" ]]; then
    echo "Copying $servicefile …"
    mkdir -p "${debworkdir}/etc/systemd/system"
    cp "$servicefile" "${debworkdir}/etc/systemd/system/${name}.service"
fi


# build the deb
dpkg-deb --build --root-owner-group "$debworkdir" "$debfile"

# clean up
echo "Cleaning up …"
rm -rf "$debworkdir"
