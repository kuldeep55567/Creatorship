const userTypeDef = `#graphql
     type User {
          id : ID!,
          name : String!,
          email : String!,
          password: String!,
          userType : String!,
          audienceSize : Int,
          contentTypes : [String],
          platforms : [String],
          companyName : String,
          industry : String,
          fundingStage : String,
          equityOfferRange : Int,
          bio : String,
          isAdmin : Boolean
     } 
     type Query {
          user(userId: ID): User!
     }
     type Mutation {
          register(input : RegisterInput!) : User!
     }
      input RegisterInput{
           name : String!,
           email : String!,
           password: String!,
           userType : String!
      }
`;
export default userTypeDef;
