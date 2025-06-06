import NotifcationCard from "./NotifcationCard";


const data = [
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e5f" },
    "recipientRole": "agent",
    "type": "new_listing",
    "message": "A new property listing is available for review.",
    "read": false,
    "mode": "individual"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e5f" },
    "recipientRole": "client",
    "type": "listing_approved",
    "message": "Your property listing has been approved.",
    "read": true,
    "mode": "individual"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e60" },
    "recipientRole": "admin",
    "type": "user_reported",
    "message": "A user has been reported for suspicious activity.",
    "read": true,
    "mode": "broadcast"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e61" },
    "recipientRole": "agent",
    "type": "new_message",
    "message": "You have a new message from a client.",
    "read": false,
    "mode": "individual"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e62" },
    "recipientRole": "client",
    "type": "promotion",
    "message": "Check out the latest promotions for property listings.",
    "read": false,
    "mode": "broadcast"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e63" },
    "recipientRole": "admin",
    "type": "system_update",
    "message": "The system has been updated to version 2.1.",
    "read": false,
    "mode": "broadcast"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e64" },
    "recipientRole": "agent",
    "type": "task_assigned",
    "message": "A new task has been assigned to you.",
    "read": false,
    "mode": "individual"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e65" },
    "recipientRole": "client",
    "type": "listing_expired",
    "message": "Your property listing has expired.",
    "read": false,
    "mode": "individual"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e66" },
    "recipientRole": "admin",
    "type": "backup_complete",
    "message": "Daily database backup completed successfully.",
    "read": false,
    "mode": "broadcast"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e67" },
    "recipientRole": "agent",
    "type": "listing_reviewed",
    "message": "A property listing you submitted has been reviewed.",
    "read": false,
    "mode": "individual"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e68" },
    "recipientRole": "client",
    "type": "new_offer",
    "message": "A new offer has been made on your property.",
    "read": false,
    "mode": "individual"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e69" },
    "recipientRole": "admin",
    "type": "server_alert",
    "message": "High CPU usage detected on the server.",
    "read": false,
    "mode": "broadcast"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e70" },
    "recipientRole": "agent",
    "type": "payment_received",
    "message": "A payment has been received for your recent sale.",
    "read": false,
    "mode": "individual"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e71" },
    "recipientRole": "client",
    "type": "feedback_request",
    "message": "Please provide feedback on your recent experience.",
    "read": false,
    "mode": "individual"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e72" },
    "recipientRole": "admin",
    "type": "security_alert",
    "message": "A new device has logged into an admin account.",
    "read": false,
    "mode": "broadcast"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e73" },
    "recipientRole": "agent",
    "type": "lead_notification",
    "message": "You have a new lead assigned to you.",
    "read": false,
    "mode": "individual"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e74" },
    "recipientRole": "client",
    "type": "account_verified",
    "message": "Your account has been successfully verified.",
    "read": false,
    "mode": "individual"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e75" },
    "recipientRole": "admin",
    "type": "scheduled_maintenance",
    "message": "Scheduled maintenance is planned for tomorrow.",
    "read": false,
    "mode": "broadcast"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e76" },
    "recipientRole": "agent",
    "type": "bonus_announcement",
    "message": "Congratulations! You've earned a bonus for outstanding performance.",
    "read": false,
    "mode": "individual"
  },
  {
    "userId": { "$oid": "64b8a2e94f1c2a1b2c3d4e77" },
    "recipientRole": "client",
    "type": "welcome",
    "message": "Welcome to our property listing app! Explore the features now.",
    "read": false,
    "mode": "individual"
  }
]


const NotificationList = () => {
  return (
    data.map((notification,index) => {
      return (
        <div className="w-full" key={index}>
        <NotifcationCard notification={notification} />
        </div>
      )
    })
  )
}

export default NotificationList