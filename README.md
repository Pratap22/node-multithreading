# Commands

### To test the load of the server

`npx loadtest -n 1200 -c 400 -k http://localhost:3000/heavy`

### Running the app in cluster mode

`npx pm2 start ecosystem.config.cjs`

### Get CPUs Count

Mac: `sysctl -n hw.ncpu`
Linux: `nproc`
Windows: `echo %NUMBER_OF_PROCESSORS%`

### To get time taken by request

`time curl --get http://localhost:3000/blocking`
