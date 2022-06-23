

var qaEnv = {
    databaseurl: 'mongodb+srv://nani_kandukuri:0wpb09h3eHnjpetu@cluster0.q6vvk.mongodb.net/?retryWrites=true&w=majority',
    //  databaseurl: process.env[app_env + databaseurl],
    s3BucketName: 'development-bbfitness',
    s3ImagesFolderName: 'qa',
    cloudFrontUrl: 'https://media-development-bbfitness.fanworld.io/',
    dbName: 'qabbfitness',
    accessKeyId: 'AKIA4RJ3O4EKVZIGWKP3',
    secretAccessKey: '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',
    ACL: 'private',
    port: 9099

}


exports = module.exports = {
    qa: qaEnv,
}
