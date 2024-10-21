#!/bin/bash
set -eo pipefail

# deb constants
version=1.0
revision=1
name=eak
architecture=all
maintainer="The Ehrenamtskarte Team <info@ehrenamtskarte.app>"

# read input
while getopts v:r:a:n:t:s:d:f:c:m:M:C:h flag
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
        M) martinfolder=${OPTARG};;
        C) configfile=${OPTARG};;
        h)
            echo "$0 [-v version] [-r revision] [-a architecture] [-n name] [-t backend_tar] [-s service_file] [-d description] [-f adminfolder] [-c dependencies] [-M martinfolder] [-C configfile]"
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
ctrlfile="${debworkdir}/DEBIAN/control"
echo "Creating control file in $ctrlfile …"
touch "$ctrlfile"
echo "Package: $name" >> "$ctrlfile"
echo "Version: $version" >> "$ctrlfile"
echo "Architecture: $architecture" >> "$ctrlfile"
echo "Maintainer: $maintainer" >> "$ctrlfile"
if [[ -n "$description" ]]; then
    echo "Description: $description" >> "$ctrlfile"
fi
if [[ -n "$dependencies" ]]; then
    echo "Depends: $dependencies" >> "$ctrlfile"
fi

# create conffiles file
if [[ -n "$configfile" ]]; then
    echo "$configfile" >> "${debworkdir}/DEBIAN/conffiles"
fi

# copy files to deb workdir
if [[ -n "$tarfile" ]]; then
    echo "Copying $tarfile …"
    mkdir -p "${debworkdir}/opt/ehrenamtskarte/backend"
    tar -xf "$tarfile" -C "${debworkdir}/opt/ehrenamtskarte"

    # create postinst for db migration to ensure that after every package upgrade a database migration runs
    postinstfile="${debworkdir}/DEBIAN/postinst"
    echo "Creating postinst file in $postinstfile ..."
    touch "$postinstfile"
    chmod 0755 "$postinstfile"
    echo "useradd -r backend" >> "$postinstfile"
    echo "sudo -u backend /opt/ehrenamtskarte/backend/bin/backend migrate" >> "$postinstfile"
fi
if [[ -n "$servicefile" ]]; then
    echo "Copying $servicefile …"
    mkdir -p "${debworkdir}/etc/systemd/system"
    cp "$servicefile" "${debworkdir}/etc/systemd/system/${name}.service"
fi
if [[ -n "$adminfolder" ]]; then
    echo "Copying $adminfolder …"
    mkdir -p "${debworkdir}/opt/ehrenamtskarte/administration"
    cp -r "$adminfolder/"* "${debworkdir}/opt/ehrenamtskarte/administration"

fi
if [[ -n "$martinfolder" ]]; then
    echo "Copying $martinfolder …"
    mkdir -p "${debworkdir}/opt/ehrenamtskarte/martin"
    cp -r "$martinfolder/"* "${debworkdir}/opt/ehrenamtskarte/martin"
fi


# build the deb
dpkg-deb --build --root-owner-group "$debworkdir" "$debfile"

# clean up
echo "Cleaning up …"
rm -rf "$debworkdir"
