# Troubleshooting

This section lists some commands that may help you to find and solve issues in a new deployment on staging or production server.
To connect on our servers you need a working yubikey.
- connect via ssh `ssh <username>@entitlementcard.tuerantuer.org` or (`entitlementcard-test.tuerantuer.org`)
- switch to root user `sudo -i` or `sudo - u <user>` to a particular user.

1) Check backend health log: `journalctl -u eak-backend.service --since "1h ago"`
2) Check backend log for particular message: `journalctl -u eak-backend.service --since "1h ago" | grep "<your message>"`
3) Restart backend service: `systemctl restart eak-backend.service`
4) Check installed version of particular debian package: `apt-cache policy eak-administration` same works for backend with `eak-backend`
5) Check available debian package versions: `ll -trh /srv/local-apt-repository`
6) Check if latest database migration was applied: `sudo -u backend psql entitlementcard` then `SELECT * from migrations;`
7) Create admin/store manager accounts: `sudo -u backend /opt/ehrenamtskarte/backend/bin/backend create-admin <command>`. You can find example in [runConfigs](../.idea/runConfigurations)
8) Check if webhook for the debian package installation worked: `journalctl -x --since "48 hours ago" | grep webhook` and find info about the debian package installation: `vim /var/log/apt/history.log`

### Import EAK accepting stores

Import of EAK accepting stores on production and staging environments run on **every odd day** of the month.

:white_check_mark: When the job completes successfully, the following log entries can be found in the system log:

```
root@entitlementcard-test ~ # grep eak-update-data /var/log/syslog
2025-04-21T02:00:01.943911+00:00 entitlementcard-test.tuerantuer.org CRON[2514930]: (backend) CMD (/usr/local/bin/eak-update-data)
2025-04-21T02:06:41.365867+00:00 entitlementcard-test.tuerantuer.org eak-update-data: Successfully imported EAK data
```

:x: If the job fails, a notification is sent to the @entitlementcard-cert channel:

`[entitlementcard-test.tuerantuer.org] ERROR eak-update-data at Wed Apr 9 04:14:19 PM UTC 2025`

The output of the job is not saved.
In case of failure the import can be restarted manually:

```
root@entitlementcard-test ~ # su - backend /opt/ehrenamtskarte/backend/bin/backend import
```
