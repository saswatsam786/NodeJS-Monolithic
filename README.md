# Food Ordering Backend Application

Welcome to the Food Ordering Backend Application! This application provides the backend services for a food delivery platform. Users can sign up, order food, and have it delivered to their location. Delivery users can also sign up, verify their accounts, and deliver food to customers. This README will guide you through the installation process and provide an overview of the application's functionalities.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Functionalities](#functionalities)
- [Contribution](#contribution)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/saswatsam786/NodeJS-Monolithic
   ```

2. Install dependencies:

   ```bash
    npm install
   ```

3. Set up the environment variables:

   ```bash
   cd src/config
   ```

   Set the variables in the `index.ts` file.

4. Start the server from home directory"
   ```bash
   npm start
   ```

## Usage

To interact with the Food Ordering Backend Application, you can use the provided API endpoints. There are different routes for customers, vendors, and delivery users, each with specific functionalities. Make HTTP requests to these routes to use the application's features.

## Functionalities

### Customer Routes

- **Sign Up**: Customers can create an account.

- **Log In**: Customers can log in to their accounts.

- **Verify Account**: Verify a customer's account using an OTP.

- **Request OTP**: Customers can request a one-time password for verification.

- **Edit Profile**: Customers can edit their profile information.

- **Add to Cart**: Customers can add items to their cart.

- **View Cart**: Customers can view the contents of their cart.

- **Delete Cart**: Customers can remove items from their cart.

- **Apply Offers**: Customers can apply special offers.

- **Create Payment**: Customers can create payment transactions.

- **Create Order**: Customers can place orders for food.

- **View Orders**: Customers can view their order history.

- **View Order Details**: Customers can view the details of a specific order.

### Vendor Routes

- **Log In**: Vendors can log in to their accounts.

- **View Profile**: Vendors can view their profile information.

- **Edit Profile**: Vendors can edit their profile information.

- **Upload Cover Image**: Vendors can upload cover images.

- **Update Service Status**: Vendors can change their service status.

- **Add Food Items**: Vendors can add food items to their menu.

- **View Food Items**: Vendors can view their food items.

- **View Current Orders**: Vendors can view their current orders.

- **Process Orders**: Vendors can update the status of an order.

- **View Order Details**: Vendors can view the details of a specific order.

- **Add Offers**: Vendors can add special offers.

- **Edit Offers**: Vendors can edit existing offers.

### Delivery User Routes

- **Sign Up**: Delivery users can create an account.

- **Log In**: Delivery users can log in to their accounts.

- **Verify Account**: Verify a delivery user's account.

- **Change Service Status**: Delivery users can change their service status.

- **View Profile**: Delivery users can view their profile information.

- **Edit Profile**: Delivery users can edit their profile information.

### Shopping Routes

- **View Food Availability**: Users can check the availability of food items based on a location (pincode).

- **View Top Restaurants**: Users can find top-rated restaurants based on a location (pincode).

- **View Food Available in 30 Minutes**: Users can find food items available within 30 minutes based on a location (pincode).

- **Search for Food**: Users can search for specific food items based on a location (pincode).

- **View Available Offers**: Users can view available offers based on a location (pincode).

- **Find Restaurant by ID**: Users can view details of a specific restaurant.

## Food API Postman Routes

[<strong>FOOD API ROUTE</strong>](https://api.postman.com/collections/14197907-b27b0397-9872-4596-a8d6-ebc11b916a13?access_key=PMAT-01HEQZK7DA15FH9B93RYJN2CGJ)

## Contribution

Contributions are welcome! If you'd like to contribute to the project, you can raise issue and start working.

**Happy Food Ordering! 🍔🍕🍣**
