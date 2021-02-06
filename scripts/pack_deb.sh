#!/bin/bash
set -eo pipefail

# deb constants
version=1.0
revision=1
name=eak
architecture=amd64
maintainer="The Ehrenamtskarte Team <info@ehrenamtskarte.app>"
description=""
dependencies=""

# read input
while getopts v:r:a:n:t:s:d:f:c:h flag
do
    case "${flag}" in
        v) version=${OPTARG};;
        r) revision=${OPTARG};;
        a) architecture=${OPTARG};;
        n) name=${OPTARG};;
        d) description=${OPTARG};;
        t) tarfile=${OPTARG};;
        f) adminfolder=${OPTARG};;
        s) servicefile=${OPTARG};;
        c) dependencies=${OPTARG};;
        h) 
            echo "$0 [-v version] [-r revision] [-a architecture] [-n name] [-t backend_tar] [-s service_file] [-d description] [-f adminfolder] [-c dependencies]"
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
if [[ -n "$adminfolder" ]]; then
    echo "Copying $adminfolder …"
    mkdir -p "${debworkdir}/opt/ehrenamtskarte/administration"
    cp "$adminfolder/"* "${debworkdir}/opt/ehrenamtskarte/administration"
fi

# build the deb
dpkg-deb --build --root-owner-group "$debworkdir" "$debfile"

# clean up
echo "Cleaning up …"
rm -rf "$debworkdir"
