import AccountChannel from '../account-channel';

const {
    Sequelize,
    Model,
    DataTypes
} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const faker = require('faker');

export default class Account extends Model {}

Account.init({
    name: DataTypes.STRING
}, {
    sequelize,
    modelName: 'account',
});

(async () => {
    await sequelize.sync();
    const accounts = await Account.bulkCreate([
        {
            name: faker.internet.email()
        },
        {
            name: faker.internet.email()
        },
        {
            name: faker.internet.email()
        },
        {
            name: faker.internet.email()
        },
        {
            name: faker.internet.email()
        },
        {
            name: faker.internet.email()
        },
    ]);
})();