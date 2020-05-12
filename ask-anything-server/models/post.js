module.exports = (sequelize, Sequelize) => {

    const Post = sequelize.define('post',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        title:{ 
            type: Sequelize.STRING,
            allowNull: false,
        },
        content:{ 
            type: Sequelize.STRING,
            allowNull: false,
        },
        tags:{
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: false,
        }

    });

    Post.associate = (models) => {
        Post.belongsTo(models.User, {
            constraints: true, 
            onDelete: 'CASCADE'
        });
    }

    return Post;
}