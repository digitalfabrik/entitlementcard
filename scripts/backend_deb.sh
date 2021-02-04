#!/bin/bash
set -eo pipefail

# deb constants
version=1.0
revision=1
name=eak-backend
architecture=amd64
maintainer="The Ehrenamtskarte Team <info@ehrenamtskarte.app>"
description="Backend server for the Ehrenamtskarte app"

# read input
while getopts v:r:a:n:t:h flag
do
    case "${flag}" in
        v) version=${OPTARG};;
        r) revision=${OPTARG};;
        a) architecture=${OPTARG};;
        n) name=${OPTARG};;
        t) tarfile=${OPTARG};;
        h) 
            echo "$0 [-v version] [-r revision] [-a architecture] [-n name] -t backend_tar"
            exit 0;;
    esac
done

if [[ -z "$tarfile" ]]; then
    echo "Must provide input tar file using -t file" 1>&2
    exit 1
fi

debworkdir=$(mktemp -d)
fullname=${name}_${version}-${revision}_${architecture}
debfile=${fullname}.deb

# init deb workdir
mkdir ${debworkdir}/DEBIAN
ctrlfile=${debworkdir}/DEBIAN/control
echo "Creating control file in $ctrlfile …"
touch $ctrlfile
echo "Package: $name" >> $ctrlfile
echo "Version: $version" >> $ctrlfile
echo "Architecture: $architecture" >> $ctrlfile
echo "Maintainer: $maintainer" >> $ctrlfile
echo "Description: $description" >> $ctrlfile

# copy files to deb workdir
echo "Copying $tarfile …"
mkdir -p ${debworkdir}/var/ehrenamtskarte/backend
tar -xf $tarfile -C ${debworkdir}/var/ehrenamtskarte

# build the deb
dpkg-deb --build --root-owner-group $debworkdir $debfile

# clean up
echo "Cleaning up …"
rm -rf $debworkdir
