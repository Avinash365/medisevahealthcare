import { all_routes } from "../../routes/all_routes";

const route = all_routes;

export const SidebarData = [

{
  label: "Main",
  submenuOpen: true,
  showSubRoute: false,
  submenuHdr: "Main",
  submenuItems: [
  {
    label: "Dashboard",
    icon: 'layout-grid',
    submenu: true,
    showSubRoute: false,

    submenuItems: [
    { label: "Admin Dashboard", link: "/index" }]

  },
  {
    label: "Doctors Onboarding",
    icon: 'user-plus',
    submenu: true,
    showSubRoute: false,
    submenuItems: [
    { label: "New Onboarding", link: "/onboarding/new" },
    { label: "Show Onboarding", link: "/onboarding" }]

  },
  {
    label: "Appointment",
    icon: 'calendar',
    submenu: true,
    showSubRoute: false,
    submenuItems: [
    { label: "Book Appointment", link: "/appointments/book" },
    { label: "Show Appointment", link: "/appointments" }]

  },
  {
    label: "Super Admin",
    icon: 'user-edit',
    submenu: true,
    showSubRoute: false,

    submenuItems: [
    { label: "Dashboard", link: "/dashboard" },
    { label: "Companies", link: "/companies" },
    { label: "Subscriptions", link: "/subscription" },
    { label: "Packages", link: "/packages" },
    { label: "Domain", link: "/domain" },
    { label: "Purchase Transaction", link: route.purchasetransaction }]

  },
  {
    label: "Layouts",
    icon: 'layout-sidebar-right-collapse',
    submenu: true,
    showSubRoute: false,
    submenuItems: [
    { label: "Horizontal", link: route.Horizontal, showSubRoute: false },
    { label: "Detached", link: route.Detached, showSubRoute: false },
    // { label: "Modern", link: route.Modern, showSubRoute: false },
    { label: "Two Column", link: route.TwoColumn, showSubRoute: false },
    { label: "Hovered", link: route.Hovered, showSubRoute: false },
    { label: "Boxed", link: route.Boxed, showSubRoute: false },
    { label: "RTL", link: route.RTL, showSubRoute: false },
    { label: "Dark", link: route.Dark, showSubRoute: false }]

  }]

},
{
  label: "Inventory",
  submenuOpen: true,
  showSubRoute: false,
  submenuHdr: "Inventory",
  submenuItems: [
  {
    label: "Products",
    link: "/product-list",
    icon: 'box',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Create Product",
    link: "/add-product",
    icon: 'table-plus',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Expired Products",
    link: "/expired-products",
    icon: 'progress-alert',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Low Stocks",
    link: "/low-stocks",
    icon: 'trending-up-2',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Category",
    link: "/category-list",
    icon: 'list-details',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Sub Category",
    link: "/sub-categories",
    icon: 'carousel-vertical',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Brands",
    link: "/brand-list",
    icon: 'triangles',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Units",
    link: "/units",
    icon: 'brand-unity',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Variant Attributes",
    link: "/variant-attributes",
    icon: 'checklist',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Warranties",
    link: "/warranty",
    icon: 'certificate',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Print Barcode",
    link: "/barcode",
    icon: 'barcode',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Print QR Code",
    link: "/qrcode",
    icon: 'qrcode',
    showSubRoute: false,
    submenu: false
  }]

},
{
  label: "Stock",
  submenuOpen: true,
  submenuHdr: "Stock",
  submenu: true,
  showSubRoute: false,
  submenuItems: [
  {
    label: "Manage Stock",
    link: "/manage-stocks",
    icon: 'stack-3',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Stock Adjustment",
    link: "/stock-adjustment",
    icon: 'stairs-up',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Stock Transfer",
    link: "/stock-transfer",
    icon: 'stack-pop',
    showSubRoute: false,
    submenu: false
  }]

},
{
  label: "Agents",
  submenuOpen: true,
  submenuHdr: "Sales",
  submenu: false,
  showSubRoute: false,
  submenuItems: [
  {
    label: "Our Agents",
    icon: 'layout-grid',
    showSubRoute: false,
    submenu: true,
    submenuItems: [
    { label: "Super Agents", link: route.onlineorder, showSubRoute: false },
    { label: "Agents", link: route.posorder, showSubRoute: false }]

  },
  {
    label: "Set Commission",
    link: route.invoice,
    icon: 'file-invoice',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Ammount Withdrawal ",
    link: "/sales-returns",
    icon: 'receipt-refund',
    showSubRoute: false,
    submenu: false
  }]

},
{
  label: "Promo",
  submenuOpen: true,
  submenuHdr: "Promo",
  showSubRoute: false,
  submenuItems: [
  {
    label: "Coupons",
    link: "/coupons",
    icon: 'ticket',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Gift Cards",
    link: route.GiftCard,
    icon: 'cards',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Discount",
    icon: 'file-percent',
    showSubRoute: false,
    submenu: true,
    submenuItems: [
    { label: "Discount Plan", link: route.discountPlan, showSubRoute: false },
    { label: "Discount", link: route.discount, showSubRoute: false }]

  }]

},
{
  label: "Medicines",
  submenuOpen: true,
  submenuHdr: "Purchases",
  showSubRoute: false,
  submenuItems: [
  {
    label: "Create Order",
    link: "/purchase-list",
    icon: 'shopping-bag',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "View Order",
    link: "/purchase-order-report",
    icon: 'file-unknown',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Track Order",
    link: "/purchase-returns",
    icon: 'file-upload',
    showSubRoute: false,
    submenu: false
  }]

},

{
  label: "Finance & Accounts",
  submenuOpen: true,
  showSubRoute: false,
  submenuHdr: "Finance & Accounts",
  submenuItems: [
  {
    label: "Expenses",
    submenu: true,
    showSubRoute: false,
    icon: 'file-stack',
    submenuItems: [
    { label: "Expenses", link: "/expense-list", showSubRoute: false },
    {
      label: "Expense Category",
      link: "/expense-category",
      showSubRoute: false
    }]

  },
  {
    label: "Income",
    submenu: true,
    showSubRoute: false,
    icon: 'file-pencil',
    submenuItems: [
    { label: "Income", link: "/income", showSubRoute: false },
    {
      label: "Income Category",
      link: "/income-category",
      showSubRoute: false
    }]

  },
  {
    label: "Bank Accounts",
    link: route.accountlist,
    icon: 'building-bank',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Money Transfer",
    link: "/money-transfer",
    icon: 'moneybag',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Balance Sheet",
    link: "/balance-sheet",
    icon: 'report-money',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Trial Balance",
    link: "/trial-balance",
    icon: 'alert-circle',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Cash Flow",
    link: "/cash-flow",
    icon: 'zoom-money',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Account Statement",
    link: "/account-statement",
    icon: 'file-infinity',
    showSubRoute: false,
    submenu: false
  }]

},

{
  label: "Customers",
  submenuOpen: true,
  showSubRoute: false,
  submenuHdr: "People",

  submenuItems: [
  {
    label: "Patient",
    link: route.customers,
    icon: 'users-group',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Billers",
    link: "/billers",
    icon: 'user-up',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Suppliers",
    link: "/suppliers",
    icon: 'user-dollar',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Stores",
    link: "/store-list",
    icon: 'home-bolt',
    showSubRoute: false,
    submenu: false
  },
  {
    label: "Warehouses",
    link: "/warehouse",
    icon: 'archive',
    showSubRoute: false,
    submenu: false
  }]

},

{
  label: "HRM",
  submenuOpen: true,
  showSubRoute: false,
  submenuHdr: "HRM",
  submenuItems: [
  {
    label: "Employees",
    link: "/employees-grid",
    icon: 'user',
    showSubRoute: false
  },
  {
    label: "Departments",
    link: "/department-grid",
    icon: 'compass',
    showSubRoute: false
  },
  {
    label: "Designations",
    link: "/designation",
    icon: 'git-merge',
    showSubRoute: false
  },
  {
    label: "Shifts",
    link: "/shift",
    icon: 'arrows-shuffle',
    showSubRoute: false
  },

  {
    label: "Attendance",
    link: "#",
    icon: 'user-cog',
    showSubRoute: false,
    submenu: true,

    submenuItems: [
    { label: "Employee", link: "/attendance-employee" },
    { label: "Admin", link: "/attendance-admin" }]

  },
  {
    label: "Leaves",
    link: "#",
    icon: 'calendar',
    showSubRoute: false,
    submenu: true,
    submenuItems: [
    { label: "Employee Leaves", link: "/leaves-employee" },
    { label: "Admin Leaves", link: "/leaves-admin" },
    { label: "Leave Types", link: "/leave-types" }]

  },
  {
    label: "Holidays",
    link: "/holidays",
    icon: 'calendar-share',
    showSubRoute: false
  },

  {
    label: "Payroll",
    link: "#",
    icon: 'file-dollar',
    showSubRoute: false,
    submenu: true,
    submenuItems: [
    { label: "Employee Salary", link: route.payrollList },
    { label: "Payslip", link: "/payslip" }]

  }]

},
{
  label: "Reports",
  submenuOpen: true,
  showSubRoute: false,
  submenuHdr: "Reports",
  submenuItems: [
  {
    label: "Sales Report",
    icon: 'chart-bar',
    showSubRoute: false,
    submenu: true,
    submenuItems: [
    { label: "Sales Report", link: "/sales-report" },
    { label: "Best Seller", link: "/best-seller" }]

  },
  {
    label: "Purchase Report",
    link: "/purchase-report",
    icon: 'chart-pie-2',
    showSubRoute: false
  },
  {
    label: "Inventory Report",
    icon: 'triangle-inverted',
    showSubRoute: false,
    submenu: true,
    submenuItems: [
    { label: "Inventory Report", link: "/inventory-report" },
    { label: "Stock History", link: "/stock-history" },
    { label: "Sold Stock", link: "/sold-stock" }]

  },
  {
    label: "Invoice Report",
    link: route.invoicereportnew,
    icon: 'businessplan',
    showSubRoute: false
  },
  {
    label: "Supplier Report",
    icon: 'user-star',
    showSubRoute: false,
    submenu: true,
    submenuItems: [
    { label: "Supplier Report", link: "/supplier-report" },
    { label: "Supplier Due Report", link: "/supplier-due-report" }]

  },
  {
    label: "Customer Report",

    icon: 'report',
    showSubRoute: false,
    submenu: true,
    submenuItems: [
    { label: "Customer Report", link: "/customer-report" },
    { label: "Customer Due Report", link: "/customer-due-report" }]

  },
  {
    label: "Product Report",
    icon: 'report-analytics',
    showSubRoute: false,
    submenu: true,
    submenuItems: [
    { label: "Product Report", link: "/product-report" },
    { label: "Product Expiry Report", link: "/product-expiry-report" },
    { label: "Product Quantity Alert", link: route.productquantityreport }]

  },
  {
    label: "Expense Report",
    link: "/expense-report",
    icon: 'file-vector',
    showSubRoute: false
  },
  {
    label: "Income Report",
    link: "/income-report",
    icon: 'chart-ppf',
    showSubRoute: false
  },
  {
    label: "Tax Report",
    link: "/tax-report",
    icon: 'chart-dots-2',
    showSubRoute: false
  },
  {
    label: "Profit & Loss",
    link: "/profit-loss-report",
    icon: 'chart-donut',
    showSubRoute: false
  },
  {
    label: "Annual Report",
    link: "/annual-report",
    icon: 'report-search',
    showSubRoute: false
  }]

},

{
  label: "Website (Frontend))",
  submenuOpen: true,
  showSubRoute: false,
  submenuHdr: "Content (CMS)",
  submenuItems: [
  {
    label: "Pages",
    icon: 'page-break',
    showSubRoute: false,
    submenu: true,
    submenuItems: [
    { label: "Pages", link: "/pages" }]

  },
  {
    label: "Blog",
    icon: 'wallpaper',
    showSubRoute: false,
    submenu: true,
    submenuItems: [
    { label: "All Blog", link: all_routes.allBlogs },
    { label: "Blog Tags", link: all_routes.blogTag },
    { label: "Categories", link: all_routes.blogCategories },
    { label: "Blog Comments", link: all_routes.blogComments }]

  },
  {
    label: "Location",
    icon: 'map-pin',
    showSubRoute: false,
    submenu: true,
    submenuItems: [
    { label: "Countries", link: all_routes.countries },
    { label: "States", link: all_routes.states },
    { label: "Cities", link: all_routes.cities }]

  },
  {
    label: "Testimonials",
    icon: 'star',
    link: all_routes.testimonial,
    showSubRoute: false,
    submenu: false
  },
  {
    label: "FAQ",
    icon: 'help-circle',
    link: all_routes.faq,
    showSubRoute: false,
    submenu: false
  }]


},
{
  label: "User Management",
  submenuOpen: true,
  showSubRoute: false,
  submenuHdr: "User Management",
  submenuItems: [
  {
    label: "Users",
    link: "/users",
    icon: 'shield-up',
    showSubRoute: false
  },
  {
    label: "Roles & Permissions",
    link: "/roles-permissions",
    icon: 'jump-rope',
    showSubRoute: false
  },
  {
    label: "Delete Account Request",
    link: "/delete-account",
    icon: 'trash-x',
    showSubRoute: false
  }]

},
{
  label: "Pages",
  submenuOpen: true,
  showSubRoute: false,
  submenuHdr: "Pages",
  submenuItems: [
  {
    label: "Profile",
    link: "/profile",
    icon: 'user-circle',
    showSubRoute: false
  },
  {
    label: "Authentication",
    submenu: true,
    showSubRoute: false,
    icon: 'shield',
    submenuItems: [
    {
      label: "Login",
      submenu: true,
      showSubRoute: false,
      submenuItems: [
      { label: "Cover", link: "/signin", showSubRoute: false },
      { label: "Illustration", link: "/signin-2", showSubRoute: false },
      { label: "Basic", link: "/signin-3", showSubRoute: false }]

    },
    {
      label: "Register",
      submenu: true,
      showSubRoute: false,
      submenuItems: [
      { label: "Cover", link: "/register", showSubRoute: false },
      { label: "Illustration", link: "/register-2", showSubRoute: false },
      { label: "Basic", link: "/register-3", showSubRoute: false }]

    },
    {
      label: "Forgot Password",
      submenu: true,
      showSubRoute: false,
      submenuItems: [
      { label: "Cover", link: "/forgot-password", showSubRoute: false },
      { label: "Illustration", link: "/forgot-password-2", showSubRoute: false },
      { label: "Basic", link: "/forgot-password-3", showSubRoute: false }]

    },
    {
      label: "Reset Password",
      submenu: true,
      showSubRoute: false,
      submenuItems: [
      { label: "Cover", link: "/reset-password", showSubRoute: false },
      { label: "Illustration", link: "/reset-password-2", showSubRoute: false },
      { label: "Basic", link: "/reset-password-3", showSubRoute: false }]

    },
    {
      label: "Email Verification",
      submenu: true,
      showSubRoute: false,
      submenuItems: [
      {
        label: "Cover",
        link: "/email-verification",
        showSubRoute: false
      },
      {
        label: "Illustration",
        link: "/email-verification-2",
        showSubRoute: false
      },
      {
        label: "Basic",
        link: "/email-verification-3",
        showSubRoute: false
      }]

    },
    {
      label: "2 Step Verification",
      submenu: true,
      showSubRoute: false,
      submenuItems: [
      {
        label: "Cover",
        link: "/two-step-verification",
        showSubRoute: false
      },
      {
        label: "Illustration",
        link: "/two-step-verification-2",
        showSubRoute: false
      },
      {
        label: "Basic",
        link: "/two-step-verification-3",
        showSubRoute: false
      }]

    },
    { label: "Lock Screen", link: "/lock-screen", showSubRoute: false }]

  },
  {
    label: "Error Pages",
    submenu: true,
    showSubRoute: false,
    icon: 'file-x',
    submenuItems: [
    { label: "404 Error", link: "/error-404", showSubRoute: false },
    { label: "500 Error", link: "/error-500", showSubRoute: false }]

  },
  // {
  //   label: "Places",
  //   submenu: true,
  //   showSubRoute: false,
  //   icon: <Icon.Map />,
  //   submenuItems: [
  //     { label: "Countries", link: "countries",showSubRoute: false },
  //     { label: "States", link: "states",showSubRoute: false }
  //   ]
  // },
  {
    label: "Blank Page",
    link: "/blank-page",
    icon: 'file',
    showSubRoute: false
  },
  {
    label: "Pricing",
    link: route.pricing,
    icon: 'currency-dollar',
    showSubRoute: false
  },
  {
    label: "Coming Soon",
    link: "/coming-soon",
    icon: 'send',
    showSubRoute: false
  },
  {
    label: "Under Maintenance",
    link: "/under-maintenance",
    icon: 'alert-triangle',
    showSubRoute: false
  }]

},

{
  label: "Settings",
  submenu: true,
  showSubRoute: false,
  submenuHdr: "Settings",
  submenuItems: [
  {
    label: "General Settings",
    submenu: true,
    showSubRoute: false,
    icon: 'settings',
    submenuItems: [
    { label: "Profile", link: "/general-settings" },
    { label: "Security", link: "/security-settings" },
    { label: "Notifications", link: "/notification" },
    { label: "Connected Apps", link: "/connected-apps" }]

  },
  {
    label: "Website Settings",
    submenu: true,
    showSubRoute: false,
    icon: 'world',
    submenuItems: [
    {
      label: "System Settings",
      link: "/system-settings",
      showSubRoute: false
    },
    {
      label: "Company Settings",
      link: "/company-settings",
      showSubRoute: false
    },
    {
      label: "Localization",
      link: "/localization-settings",
      showSubRoute: false
    },
    { label: "Prefixes", link: "/prefixes", showSubRoute: false },
    { label: "Preference", link: "/preference", showSubRoute: false },
    { label: "Appearance", link: "/appearance", showSubRoute: false },
    {
      label: "Social Authentication",
      link: "/social-authentication",
      showSubRoute: false
    },
    {
      label: "Language",
      link: "/language-settings",
      showSubRoute: false
    }]

  },
  {
    label: "App Settings",
    submenu: true,

    showSubRoute: false,
    icon: 'device-mobile',
    submenuItems: [
    {
      label: "Invoice",
      link: "/invoice-settings",
      showSubRoute: false,
      submenu: true,
      submenuItems: [
      { label: "Invoice Settings", link: "/invoice-settings" },
      { label: "Invoice Template", link: "/invoice-template" }]

    },
    { label: "Printer", link: "/printer-settings", showSubRoute: false },
    { label: "POS", link: "/pos-settings", showSubRoute: false },
    {
      label: "Custom Fields",
      link: "/custom-fields",
      showSubRoute: false
    }]

  },
  {
    label: "System Settings",
    submenu: true,
    showSubRoute: false,
    icon: 'device-desktop',
    submenuItems: [
    {
      label: "Email",
      link: "/email-settings",
      showSubRoute: false,
      submenu: true,
      submenuItems: [
      { label: "Email Settings", link: "/email-settings" },
      { label: "Email Template", link: "/email-template" }]

    },
    {
      label: "SMS Gateways",
      link: "/sms-gateway",
      showSubRoute: false,
      submenu: true,
      submenuItems: [
      { label: "SMS Settings", link: "/sms-settings" },
      { label: "SMS Template", link: route.smstemplate }]

    },
    { label: "OTP", link: "/otp-settings", showSubRoute: false },
    {
      label: "GDPR Cookies",
      link: "/gdpr-settings",
      showSubRoute: false
    }]

  },
  {
    label: "Logout",
    link: "/signin",
    icon: 'logout',
    showSubRoute: false
  }]

},
{
  label: "Help",
  submenuOpen: true,
  showSubRoute: false,
  submenuHdr: "Help",
  submenuItems: [
  {
    label: "Documentation",
    link: "#",
    icon: 'file-text',
    showSubRoute: false
  },
  {
    label: "Multi Level",
    showSubRoute: false,
    submenu: true,
    icon: 'menu-2',
    submenuItems: [
    { label: "Level 1.1", link: "#", showSubRoute: false },
    {
      label: "Level 1.2",
      submenu: true,
      showSubRoute: false,
      submenuItems: [
      { label: "Level 2.1", link: "#", showSubRoute: false },
      {
        label: "Level 2.2",
        submenu: true,
        showSubRoute: false,
        submenuItems: [
        { label: "Level 3.1", link: "#", showSubRoute: false },
        { label: "Level 3.2", link: "#", showSubRoute: false }]

      }]

    }]

  }]

}];