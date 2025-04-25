#!/bin/bash
./gost -D -L socks5://127.0.0.1:31000 &
./gost -D -L rtcp://:21000/127.0.0.1:31000 -F "relay+ws://dv4.li0102.site:80?path=/bce8e8e3-f3de-4d4c-8fde-d0c40a88a24a&host=dv4.li0102.site"
