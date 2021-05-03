import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from './App';
import Account from './models/account';
import AccountChannel from './models/account-channel';
import Channel from './models/channel';
import Reward from './models/reward';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint] ? assets[entrypoint].css ?
    assets[entrypoint].css.map(asset =>
      `<link rel="stylesheet" href="${asset}">`
    ).join('') : '' : '';
};

const jsScriptTagsFromAssets = (assets, entrypoint, extra = '') => {
  return assets[entrypoint] ? assets[entrypoint].js ?
    assets[entrypoint].js.map(asset =>
      `<script src="${asset}"${extra}></script>`
    ).join('') : '' : '';
};

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))

  /**
   * API
   */
  .get('/api/health', (req, res) => {
    res.json({
      health: 'ok'
    })
  })

  .get('/api/accounts', async (req, res) => {

    const accounts = await Account.findAll();

    res.json(accounts)
  })

  .get('/api/accounts/:id', async (req, res) => {

    const account = await Account.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!account) {
      res.json({
        error: 'account could not be found'
      }, 404)
    } else {
      res.json(account)
    }
  })

  .get('/api/rewards', async (req, res) => {
    const rewards = await Reward.findAll();

    res.json(rewards)
  })


  .get('/api/rewards/:id', async (req, res) => {

    const reward = await Reward.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!reward) {
      res.json({
        error: 'reward could not be found'
      }, 404)
    } else {
      res.json(reward)
    }
  })

  .get('/api/channels', async (req, res) => {
    const channels = await Channel.findAll();

    res.json(channels)
  })

  .get('/api/channels/:id', async (req, res) => {

    const channel = await Channel.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!channel) {
      res.json({
        error: 'channel could not be found'
      }, 404)
    } else {
      res.json(channel)
    }
  })

  .get('/api/channels/:id/rewards', async (req, res) => {

    const rewards = await Reward.findAll({
      where: {
        channel_id: req.params.id
      }
    });

    res.json(rewards);
  })

  .get('/api/accounts/:id/channels', async (req, res) => {

    const accountChannels = await AccountChannel.findAll({
      where: {
        account_id: req.params.id
      },
    });

    res.json(accountChannels);
  })

  .get('/api/accounts/:id/eligibility', async (req, res) => {

    try {
      const accountChannels = await AccountChannel.findAll({
        where: {
          account_id: req.params.id
        },
      });

      const rewards = await Reward.findAll({
        where: {
          channel_id: accountChannels.map(({ channel_id }) => channel_id)
        }
      })

      res.json({
        status: rewards.length > 0 ? 'CUSTOMER_ELIGIBLE' : 'CUSTOMER_INELIGIBLE',
        rewards
      });
    } catch (e) {
      res.json({
        error: 'Service technical failure'
      }, 500);
    }
  })

  /**
   * APP
   */
  .get('/*', (req, res) => {
    const context = {};
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${cssLinksFromAssets(assets, 'client')}
    </head>
    <body>
        <div id="root">${markup}</div>
        ${jsScriptTagsFromAssets(assets, 'client', ' defer crossorigin')}
    </body>
</html>`
      );
    }
  });

export default server;
