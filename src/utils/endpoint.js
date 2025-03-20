

module.exports = class EndPoint {

    // Base URL
    ASSET_BASE_URL = "/api/asset";
    CATEGORY_BASE_URL = "/api/category";
    DEPARTMENT_BASE_URL = "/api/department";
    LOCATION_BASE_URL = "/api/location";
    USER_BASE_URL = "/api/user";
    MAINTENANCE_BASE_URL = "/api/maintenance";

    // Asset Endpoints
    ASSET_CREATE = "/create/asset";
    ASSET_READ_ALL = "/read/assets";
    ASSET_EDIT = "/edit/asset";
    ASSET_DELETE = "/delete/:AssetID";
    ASSET_METRIC = "/metric/assets";

    // User Endpoints
    USER_CREATE = "/create/user";
    USER_READ_ONE = "/read/:UserID";
    USER_READ_ALL = "/read/users";
    USER_EDIT = "/edit/user";
    USER_DELETE = "/delete/:UserID";
    USER_METRIC = "/metric/users";

    // Category Endpoints
    CATEGORY_CREATE = "/create/category";
    CATEGORY_READ_ALL = "/read/categories";
    CATEGORY_EDIT = "/edit/category";
    CATEGORY_DELETE = "/delete/:CategoryID";
    CATEGORY_METRIC = "/metric/categories";

    // Location Endpoints
    LOCATION_CREATE = "/create/location";
    LOCATION_READ_ALL = "/read/locations";
    LOCATION_EDIT = "/edit/location";
    LOCATION_DELETE = "/delete/:LocationID";
    LOCATION_METRIC = "/metric/locations";

    // Department Endpoints
    DEPARTMENT_CREATE = "/create/department";
    DEPARTMENT_READ_ALL = "/read/departments";
    DEPARTMENT_EDIT = "/edit/department";
    DEPARTMENT_DELETE = "/delete/:DepartmentID";
    DEPARTMENT_METRIC = "/metric/departments";

    // AssetMaintenance Endpoints
    MAINTENANCE_CREATE = "/create/maintenance";
    MAINTENANCE_READ_ALL = "/read/maintenances";
    MAINTENANCE_EDIT = "/edit/maintenance";
    MAINTENANCE_DELETE = "/delete/:MaintenanceID";
    MAINTENANCE_METRIC = "/metric/maintenances";

}