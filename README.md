# js-eureka-springcloud

## install
npm install js-eureka-client-springcloud

## usage

const eureka = require('js-eureka-client-springcloud');

eureka.start('appName', 80, 'http://eureka.primary/eureka/apps', tags = 'tag')
