import crypto from 'crypto';
import Moment from 'moment';

import mysql from './db';

class Repository {
  static async getRawChartData({ category, type, start, end }) {
    const data = await mysql.query({
      sql: `
        SELECT
          price, area, area_measurement,
          price_per_sqm, published_at
        FROM properties
        WHERE published_at BETWEEN ? AND ?
        ${type ? `AND type = "${type.toLowerCase()}"` : ''} # @todo: sanitize
        ${category ? `AND category = "${category.toLowerCase()}"` : ''}
        AND location_country = "Latvia"
        AND price > 1
      `,

      values: [start, end],
      typeCast(field, next) {
        if (field.name === 'published_at') {
          return `${field.string().substr(0, 7)}-01`;
        }

        return next();
      },
    });

    return data.map((row) => {
      if (!row.price_per_sqm && row.area_measurement === 'm2' && row.area) {
        row.price_per_sqm = row.price / row.area;
      }

      return row;
    });
  }

  static async getPingers(email) {
    return await mysql.query({
      sql: `
        SELECT *
        FROM pinger_emails
        WHERE email = ?
      `,
      values: [email],
    });
  }

  static async createPinger(args) {
    const { affectedRows } = await mysql.query({
      sql: `
        INSERT INTO pinger_emails
        SET
          email = ?,
          category = ?,
          type = ?,
          price_min = ?,
          price_max = ?,
          location = ?,
          rooms_min = ?,
          rooms_max = ?,
          area_m2_min = ?,
          area_m2_max = ?,
          comments = ?,
          unsubscribe_key = ?,
          confirmed = 0
      `,
      values: [
        args.email,
        args.category,
        args.type,
        args.price_min,
        args.price_max,
        args.location,
        args.rooms_min,
        args.rooms_max,
        args.area_m2_min,
        args.area_m2_max,
        args.comments,
        crypto.randomBytes(20).toString('hex'),
      ],
    });

    return affectedRows === 1;
  }
}

export default Repository;
