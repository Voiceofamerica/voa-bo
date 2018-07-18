#!/usr/bin/env bash
sed -i .bak 's/content src="[^"]\{1,\}"/content src="http:\/\/127.0.0.1:3000"/' ./config.xml
