# Deployment Guide for Render.com

This guide will help you deploy your dating/matching application to Render.com.

## Prerequisites

- A Render.com account (free tier available)
- Your application code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Create PostgreSQL Database

1. Log in to [Render.com](https://render.com)
2. Click "New +" and select "PostgreSQL"
3. Configure your database:
   - **Name**: `dating-app-db` (or your preferred name)
   - **Database**: `dating_app`
   - **User**: Auto-generated
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 15 or higher
   - **Plan**: Free or paid based on your needs
4. Click "Create Database"
5. Wait for the database to be provisioned
6. Note down the **Internal Database URL** (we'll use this for the web service)

## Step 2: Create Web Service

1. From the Render dashboard, click "New +" and select "Web Service"
2. Connect your Git repository
3. Configure your web service:

### Basic Settings
- **Name**: `dating-app` (or your preferred name)
- **Region**: Same as your database
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave blank
- **Runtime**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Environment Variables
Add the following environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | Use "Add from service" and select your PostgreSQL database | This links to your Render database |
| `SESSION_SECRET` | Generate a random 32+ character string | Use a password generator |
| `NODE_ENV` | `production` | Sets production mode |
| `PORT` | `5000` | Render will override this, but it's good to set |

### Advanced Settings
- **Auto-Deploy**: Enable (deploys automatically on git push)
- **Health Check Path**: `/` (optional but recommended)

4. Click "Create Web Service"

## Step 3: Initialize Database Schema

After your web service is deployed:

1. Go to your web service in the Render dashboard
2. Click on "Shell" tab
3. Run the following command to initialize your database:
   ```bash
   npm run db:push
   ```

This will create all the necessary tables (users, profiles, likes, matches, messages, activity_logs).

## Step 4: Create First Admin User

You'll need to manually set the first admin user in the database:

1. Register a new account through your deployed application
2. Go to your PostgreSQL database in Render dashboard
3. Click "Connect" and choose "External Connection"
4. Use a PostgreSQL client (like TablePlus, pgAdmin, or psql) to connect
5. Run this SQL to make your account an admin:
   ```sql
   UPDATE users SET "isAdmin" = true WHERE email = 'your-email@example.com';
   ```

## Step 5: Configure Replit Auth (If Using)

If you're using Replit Auth:

1. Update your Replit Auth configuration to include your Render.com domain
2. Add your production URL to the allowed redirect URLs
3. Update the `ISSUER_URL` environment variable if needed

## Configuration Files

Make sure these files are properly configured:

### package.json
```json
{
  "scripts": {
    "build": "vite build",
    "start": "NODE_ENV=production node dist/index.js",
    "db:push": "drizzle-kit push"
  }
}
```

### server/index.ts
Ensure your server binds to the correct port:
```typescript
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Environment Variables Reference

### Required Variables
- `DATABASE_URL`: PostgreSQL connection string (auto-populated by Render)
- `SESSION_SECRET`: Random secret for session encryption (generate a secure random string)
- `NODE_ENV`: Set to `production`

### Optional Variables (If Using Replit Auth)
- `ISSUER_URL`: Replit Auth issuer URL
- `CLIENT_ID`: Your Replit Auth client ID
- `CLIENT_SECRET`: Your Replit Auth client secret

## Post-Deployment Checklist

- [ ] Database tables created successfully
- [ ] Web service is running without errors
- [ ] Can access the landing page
- [ ] User registration works
- [ ] User login works
- [ ] Profile creation/editing works
- [ ] Browsing profiles works
- [ ] Like/match system works
- [ ] Real-time chat works
- [ ] Admin panel accessible (for admin users)
- [ ] WebSocket connections work (check browser console)

## Monitoring and Logs

### View Logs
1. Go to your web service in Render dashboard
2. Click on "Logs" tab
3. Monitor for any errors or issues

### Common Issues

#### Database Connection Errors
- Verify `DATABASE_URL` environment variable is set correctly
- Check if database is running and accessible
- Ensure database schema has been pushed

#### Build Failures
- Check build logs for specific errors
- Verify all dependencies are in `package.json`
- Ensure Node version is compatible (16+ recommended)

#### WebSocket Issues
- Render supports WebSocket connections on all plans
- Ensure your WebSocket endpoint is `/ws`
- Check browser console for connection errors

## Scaling Considerations

### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- 750 hours/month of running time
- Shared resources

### Paid Tier Benefits
- Always-on services
- Custom domains
- More resources (CPU, RAM)
- Better performance
- Automatic SSL certificates

## Custom Domain Setup

1. Go to your web service settings
2. Click "Custom Domains"
3. Add your domain name
4. Update your DNS records as instructed by Render
5. Wait for SSL certificate to be issued (automatic)

## Backup and Maintenance

### Database Backups
- Render automatically backs up PostgreSQL databases on paid plans
- Free tier: Consider manual backups using `pg_dump`

### Updates and Maintenance
- Push changes to your Git repository
- Render will automatically deploy if auto-deploy is enabled
- Monitor deployment logs for any issues

## Support

If you encounter issues:
- Check [Render documentation](https://render.com/docs)
- Review application logs in Render dashboard
- Check database connection and schema
- Verify all environment variables are set correctly

## Security Best Practices

1. **Never commit secrets** to your Git repository
2. Use strong `SESSION_SECRET` (32+ random characters)
3. Enable HTTPS (automatic with Render)
4. Regularly update dependencies
5. Monitor application logs for suspicious activity
6. Use environment variables for all sensitive data

## Next Steps

After successful deployment:
1. Test all features thoroughly
2. Monitor performance and errors
3. Set up monitoring/alerts (optional)
4. Consider adding analytics
5. Plan for scaling as your user base grows

---

Your dating/matching application is now deployed and ready for production use! 🚀
