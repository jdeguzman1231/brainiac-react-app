import {gql} from '@apollo/client'

export const EDIT_PLATFORM = gql`
    mutation EditPlatform(
        $platformID: Int!
        $creatorName: String!
        $name: String!
        $description: String!
        $private: Boolean!
        $photo: String!
        $tags: [String]
        ){
            editPlatform(platformID: $platformID, creatorName: $creatorName, name: $name, description: $description, private: $private
                photo: $photo, tags: $tags)
              
            
        }
`;


export const CREATE_PLATFORM = gql`
    mutation createPlatform(
        $name: String!
        $creatorName: String!
        $description: String!
        $tags: [String]
    ) {
        createPlatform(
            name: $name
            creatorName: $creatorName
            description: $description
            tags: $tags
        ) {
            name
            creatorName
            description
            tags
        }
    }
`;