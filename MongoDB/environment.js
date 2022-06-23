var app_env = process.env.APP_ENVIRONMENT
console.log("data base url" + process.env[app_env + 'databaseurl']);
var qaEnv = {
    databaseurl: process.env.qadatabaseurl,
    //  databaseurl: process.env[app_env + databaseurl],
    s3BucketName: process.env.qas3BucketName,
    s3ImagesFolderName: process.env.qas3ImagesFolderName,
    cloudFrontUrl: process.env.qacloudFrontUrl,
    dbName: process.env.qadbName,
    accessKeyId: process.env.qaaccessKeyId,
    secretAccessKey: process.env.qasecretAccessKey,
    ACL: process.env.qaACL,

}

//dev
var devEnv = {
    databaseurl: process.env.devdatabaseurl,
    dbName: process.env.devdbName,
    accessKeyId: process.env.devaccessKeyId,
    secretAccessKey: process.env.devsecretAccessKey,
    s3BucketName: process.env.devs3BucketName,
    s3ImagesFolderName: process.env.devs3ImagesFolderName,
    ACL: process.env.devACL,
    port: 8080
}

var defaultEnvTypes = {
    baseUrl: process.env.baseUrl,
    databaseurl: process.env.databaseurl,
    port: process.env.port,
    apiUrl: process.env.apiUrl,
    s3BucketName: process.env.s3BucketName,
    s3ImagesFolderName: process.env.s3ImagesFolderName,
    cloudFrontUrl: process.env.cloudFrontUrl,
    dbName: process.env.qadbName
}

exports = module.exports = {
    /*dev details*/
    dev: devEnv,
    /*qa details*/
    qa: qaEnv,

    preprod: defaultEnvTypes,
    /* prod details*/
    prod: defaultEnvTypes,
    /*local details*/
    none: qaEnv
}
