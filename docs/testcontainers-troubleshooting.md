# Testcontainers troubleshooting

Testcontainers is the framework we use for integration tests in the backend.
It allows to manage application dependencies (such as database, etc) in Docker containers in test code.

Running tests based on Testcontainers requires a valid Docker environment.

If you get the following error, make sure your docker process is running and your current user has permission to execute `/var/run/docker.sock` and `/var/run/docker.pid`:

    2024-07-15T19:27:48.460+0000 [DEBUG] [TestEventLogger]     [Test worker] INFO org.testcontainers.dockerclient.DockerMachineClientProviderStrategy - docker-machine executable was not found on PATH ([/home/circleci/.local/bin, /home/circleci/.npm-global/bin, /opt/sbt/bin, /opt/gradle/bin, /opt/apache-maven/bin, /home/circleci/bin, /home/circleci/.local/bin, /usr/local/sbin, /usr/local/bin, /usr/sbin, /usr/bin, /sbin, /bin])
    2024-07-15T19:27:48.460+0000 [DEBUG] [TestEventLogger]     [Test worker] ERROR org.testcontainers.dockerclient.DockerClientProviderStrategy - Could not find a valid Docker environment. Please check configuration. Attempted configurations were:
    2024-07-15T19:27:48.460+0000 [DEBUG] [TestEventLogger]         UnixSocketClientProviderStrategy: failed with exception InvalidConfigurationException (Could not find unix domain socket). Root cause NoSuchFileException (/var/run/docker.sock)
    2024-07-15T19:27:48.460+0000 [DEBUG] [TestEventLogger]         DockerDesktopClientProviderStrategy: failed with exception NullPointerException (Cannot invoke "java.nio.file.Path.toString()" because the return value of "org.testcontainers.dockerclient.DockerDesktopClientProviderStrategy.getSocketPath()" is null)As no valid configuration was found, execution cannot continue.
    2024-07-15T19:27:48.460+0000 [DEBUG] [TestEventLogger]     See https://java.testcontainers.org/on_failure.html for more details.

To do this, run the following:
```bash
systemctl start docker
sudo chmod a+rwx /var/run/docker.pid
sudo chmod a+rwx /var/run/docker.sock
```