#!/bin/bash -e

# deb constants
version=1.0
revision=1
name=eak-backend
architecture=amd64
maintainer="The Ehrenamtskarte Team <info@ehrenamtskarte.app>"
description="Backend server for the Ehrenamtskarte app"

fullname=${name}_${version}-${revision}_${architecture}
debworkdir=build/$fullname
debfile=build/${fullname}.deb
ctrlfile=${debworkdir}/DEBIAN/control

# init deb workdir
mkdir -p $debworkdir
rm -rf ${debworkdir}/*
mkdir ${debworkdir}/DEBIAN
touch $ctrlfile
echo "Package: $name" >> $ctrlfile
echo "Version: $version" >> $ctrlfile
echo "Architecture: $architecture" >> $ctrlfile
echo "Maintainer: $maintainer" >> $ctrlfile
echo "Description: $description" >> $ctrlfile

# copy files to deb workdir
mkdir -p ${debworkdir}/var/ehrenamtskarte/backend
tar -xf build/distributions/backend.tar -C ${debworkdir}/var/ehrenamtskarte

# build the deb
dpkg-deb --build --root-owner-group $debworkdir $debfile
