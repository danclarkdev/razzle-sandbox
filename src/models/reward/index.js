const {
    Sequelize,
    Model,
    DataTypes
} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

export default class Reward extends Model {}
Reward.init({
    name: DataTypes.STRING,
    channel_id: DataTypes.INTEGER,
}, {
    sequelize,
    modelName: 'reward'
});

(async () => {
    await sequelize.sync();
    const rewards = await Reward.bulkCreate([
        {
            name: 'CHAMPIONS_LEAGUE_FINAL_TICKET',
            channel_id: 1,
        },
        {
            name: 'KARAOKE_PRO_MICROPHONE',
            channel_id: 3,
        },
        {
            name: 'PIRATES_OF_THE_CARRIBEAN_COLLECTION',
            channel_id: 5,
        },
    ]);
})();