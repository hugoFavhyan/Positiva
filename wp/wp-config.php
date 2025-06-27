<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'positiva' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'WS=Zm5O?C6<}$eY^]i:6!F3}T_HCxA@Ni,|#Ji2Ex> kCPw~2J-?c2Xr*EA&d1cV' );
define( 'SECURE_AUTH_KEY',  'A9JL`?2(wycvvMpa39:/ehmz7&XUFu6;98..#V,TRt9OT5A=j%t_UK)T9BuU&0(K' );
define( 'LOGGED_IN_KEY',    'D].;@Qw)Zi/e.w!_(@:R~v_Ar6FEoZF,Ch*6ckV+=a&91@6#5:1kOV6)nMhU$4;B' );
define( 'NONCE_KEY',        'yyvi{j+>RMMK5#F(_xE$$-s&S-7(-8[>=k%WZ[SKmr[HdYh&vW#4Zah+5~?|RJA!' );
define( 'AUTH_SALT',        '2{VJpF%Loc]yi;nWn<7VPb=Z>{`{vzR;,a$&@cFc/Mc B~yT#9p+f&#a44|0|FnW' );
define( 'SECURE_AUTH_SALT', '-cQdM@Ibp3*V}4zERm_ y)_,bO*HZ{+kto@d6}D@0@0nM_&%U%)B+OvyL+B6Ui10' );
define( 'LOGGED_IN_SALT',   'T1|>G|_Uplq!`m5Dmq*Y$~/J5ZW[H,H,$cK?e? %AOtz-bQ wrd]5=oagj%h$+LO' );
define( 'NONCE_SALT',       'nhhYYzccS`Mh</MF>?I+oGwzm6C(Iz@]@~_=zC#<B+:9~bOhOf<>5W2c?#!tzMx.' );
define( 'UPLOADS', 'media' );
/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'psv_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
