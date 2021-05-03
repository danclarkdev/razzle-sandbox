import Account from '../account';

const {
    Sequelize,
    Model,
    DataTypes
} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

export default class Channel extends Model {}
Channel.init({
    name: DataTypes.STRING,
}, {
    sequelize,
    modelName: 'channel'
});

(async () => {
    await sequelize.sync();
    const Channels = await Channel.bulkCreate([
        {
            name: 'SPORTS',
        },
        {
            name: 'KIDS',
        },
        {
            name: 'MUSIC',
        },
        {
            name: 'NEWS',
        },
        {
            name: 'MOVIES',
        },
    ]);
})();