#!/bin/sh
ls
pwd
whoami
npm audit --json | node dist/main.js