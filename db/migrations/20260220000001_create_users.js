exports.shorthands = undefined;

exports.up = async (pgm) => {
  pgm.createTable("users", {
    id: { type: "serial", primaryKey: true },
    full_name: { type: "varchar(255)", notNull: true },
    email: { type: "varchar(255)", notNull: true, unique: true },
    phone: { type: "varchar(20)", notNull: true },
    password_hash: { type: "varchar(64)", notNull: true },
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "'pending'",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = async (pgm) => {
  pgm.dropTable("users");
};
