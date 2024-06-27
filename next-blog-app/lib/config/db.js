import  mongoose from 'mongoose';

const ConnectDB=async ()=>
{
    await mongoose.connect('mongodb+srv://sohankaran35:Blogapp123@cluster1.g664fqq.mongodb.net/BlogApp');
    console.log(`${new Date().toISOString()} =>`, 'DB Connected:');
}
export default ConnectDB;