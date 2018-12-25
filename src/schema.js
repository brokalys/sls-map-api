exports.schema = `
scalar Date

type Query {
  getRegionalStats(
    category: Category!,
    type: Type!,
    start_date: Date!,
    end_date: Date!,
  ): [RegionStats!]
}

enum Category {
  APARTMENT
  HOUSE
}

enum Type {
  SELL
  RENT
}

type RegionStats {
  name: String!
  count: Int!
  min: Int
  max: Int
  mean: Float
  median: Float
  mode: Float
  standardDev: Float
}

schema {
  query: Query
}`;
