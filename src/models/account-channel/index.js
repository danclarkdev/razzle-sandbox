import Account from '../account';
import Channel from '../channel';

const {
    Sequelize,
    Model,
    DataTypes
} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const faker = require('faker');

export default class AccountChannel extends Model {}

AccountChannel.init({
    account_id: DataTypes.INTEGER,
    channel_id: DataTypes.INTEGER,
}, {
    sequelize,
    modelName: 'account-channel'
});

(async () => {
    await sequelize.sync();
    const AccountChannels = await AccountChannel.bulkCreate([
        {
            account_id: 1,
            channel_id: 1,
        },
        {
            account_id: 1,
            channel_id: 2,
        },
        {
            account_id: 1,
            channel_id: 3,
        },
        {
            account_id: 2,
            channel_id: 1,
        },
        {
            account_id: 2,
            channel_id: 4,
        },
        {
            account_id: 3,
            channel_id: 5,
        },
        {
            account_id: 4,
            channel_id: 1,
        },
        {
            account_id: 4,
            channel_id: 2,
        },
        {
            account_id: 5,
            channel_id: 2,
        },
        {
            account_id: 5,
            channel_id: 4,
        },
    ]);
})();