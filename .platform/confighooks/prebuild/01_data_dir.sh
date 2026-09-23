#!/bin/bash
# Create a persistent, app-writable folder for the JSON database.
set -e
mkdir -p /var/app/data
chown webapp:webapp /var/app/data
