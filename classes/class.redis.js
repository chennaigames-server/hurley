//  VERSION:::: 4.0.6
// URL:::::  REDIS_URL: 'redis://redis-13215.c301.ap-south-1-1.ec2.cloud.redislabs.com:13215',REDIS_PASS: 'CAiyb72ihzyt2hE3lpO8b6grYglIOypE',
module.exports = class Redis {

    constructor(url, password) {
        this.redis = require('redis');
        this.url = url;
        this.client = this.redis.createClient({
            // url: this.url,
            // password: password
            url:'redis://127.0.0.1:6379',
            password:''
        });

        this.client.connect();
        this.dbIndex = 0;
    }


    /* REDIS SLAVE DB SELECTION */
    async setDb(db_number = this.dbIndex) {

        await this.client.select(db_number, function (err) {
            if (err) throw err;
        });
    }

    /** REDIS SET AS KEY VALUE STRING */
    async setData(key, value) {

        await this.client.set(key, value, function (err) {
            console.log("errror::", err)
        })
    }

    /* REDIS GET AS KEY VALUE STRING */
    async getData(key) {
        let value = await this.client.get(key);
        return value;
    }

    /* Object set in Redis  */
    async hmsetData(key, value) {
        await this.client.hmsetData(key, value);
    }


    /* Object Get in Redis */
    async hgetallData(key) {
        let multi = this.client.multi();
        let data = await multi.hGetAll(key).exec();

        return data[0];
    }


    /** Members add  in Redis */

    async memberAdd(key, value) {
        await this.client.sAdd(key, value);
    }

    /** Members remove  in Redis */

    async memberRemove(key, value) {
        await this.client.sRem(key, value);
    }
    async memberCheck(key, value) {
        let data = await this.client.sIsMember(key, value);
        return data;
    }

    /** Get all values in members  */
    async members(key) {
        let data = await this.client.sMembers(key);
        return data;
    }

    /* Expire Time set */
    async expire(key, time) {
        await this.client.expire(key, time);
    }

    /** set a subkey values in Redis */

    async hsetData(key, subkey, value) {
        let multi = this.client.multi();
        await multi.hSet(key, subkey, value).exec();
    }

    /** Get a particular sub key value in Redis) */

    async hgetData(key, subkey) {

        let multi = this.client.multi();
        let data = await multi.hGet(key, subkey).exec();
        return data[0];
    }

    /** Delete a Particular Key in Redis */

    async deleteKey(keyname) {
        await this.client.del(keyname);
    }


    /**Store Array type data in Redis */
    async storeDataArray(key, value) {
        await this.client.rPush(key, value);
    }


    /**Get Array type data in Redis */
    async getArrayData(key) {

        let data = await this.client.lRange(key, 0, -1);
        return data;
    }

    /** update a array value  */
    async updateArray(key, index, value) {
        await this.client.lSet(key, index, value);
    }

}