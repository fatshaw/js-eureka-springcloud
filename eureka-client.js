const eureka = require('eureka-js-client')
var os = require('os');

var client = null

exports.getIpsByName = (appId) => {
  return client ? client.getInstancesByAppId(appId) : null;
}

exports.start = function (appName, port, eurekaIps, tags = null) {
  if (!eurekaIps) {
    console.error('Eureka ips is not defined!Please add EUREKA_IPS into env as string!')
    return
  }

  const ip = IP()
  const url = `${ip}:${port}`
  client = new eureka.Eureka({
    instance: {
      instanceId: `${appName}-${ip}:${port}`,
      app: appName,
      hostName: ip,
      ipAddr: ip,
      statusPageUrl: `http://${url}/info`,
      healthCheckUrl: `http://${url}/health`,
      homePageUrl: `http://${url}`,
      port: {
        '$': port,
        '@enabled': 'true',
      },
      vipAddress: appName,
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
      metadata: tags
    },
    eureka: {
      serviceUrls: {
        default: eurekaIps
      },
      preferIpAddress: true,
      registryFetchInterval: 5000,
    },
  })

  if (client) {
    client.start();
  }

  return client
}

function IP() {
  var interfaces = os.networkInterfaces()
  var addresses = []
  let eth0;
  console.log('networkInterfaces', interfaces)
  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2]
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address)
      }
      if (address.family === 'IPv4' && !address.internal && k === 'eth0') {
        eth0 = address.address;
      }
    }
  }

  return eth0 ? eth0 : addresses[0];
}

exports.stop = function stop(cb) {
  if (!client) return

  client.stop(function (err) {
    if (err) {
      console.log(`stop eureka failed:${err}`);
    } else {
      console.log('stop eureka successfully');
    }

    if (cb) {
      cb();
    }
  });

  client = null
}
