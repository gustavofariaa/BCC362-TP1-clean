'use strict';

const {publish} = require(
    '@joaoderocha/redis-pub-sub-nodejs/headless/redis/services/pub-sub',
);
const {
  messageBuilder, getNextStep, roundRobinSubscribe, TERMCLEAN,
} = require('@joaoderocha/redis-pub-sub-nodejs/headless/utils');

const cleanTerms = (linha) => linha.normalize('NFD');

const cleanPunctuation = (linha) => linha
    .replace(/[.*.,+?^${}()~!@#$:|[\]\\]/gi, '');

const termCleanStep = (channel, message) => {
  console.log(message);

  const {linha, queueIndex} = message;

  const linhaSemAcentos = cleanTerms(linha);
  const linhaLimpa = cleanPunctuation(linhaSemAcentos);
  const msg = messageBuilder(linhaLimpa, queueIndex);

  publish(getNextStep(channel), msg);
};

roundRobinSubscribe(TERMCLEAN, termCleanStep);
