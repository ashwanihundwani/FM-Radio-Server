//import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
const { GraphQLServer } = require('graphql-yoga')
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/radio_db")


const Station = mongoose.model("Station", {
    index:{
        type: Number,
        unique:true
    },
    name:String,
    streamingURL:String,
    iconURL:String,
    isActive:Boolean,
})

const typeDefs = `
  type Query {
    stations: [Station]
  }
  type Station {
      id: ID!
      index:Int!
      name:String!
      streamingURL: String!
      iconURL:String!
      isActive:Boolean!
  }
  type Mutation {
      createStation(index:Int!, name: String!, iconURL:String!, streamingURL:String!) : Station
      removeStation(id:ID!) : Boolean! 
  }
`

const resolvers = {
  Query: {
    stations: () => Station.find()
  },
  Mutation: {
      createStation: async (_, {index, name, streamingURL, iconURL}) => {
          const station = new Station({index, name, streamingURL, iconURL, isActive:true})
          await station.save();
          return station;
      },
      removeStation: async (_, {id}) => {
        let station = await Station.findByIdAndRemove(id)
        return true;
    },
      
  }
};

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server is running on localhost:4000'))