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
        $photo: String!
    ) {
        createPlatform(
            name: $name
            creatorName: $creatorName
            description: $description
            tags: $tags
            photo: $photo
        ) {
            name
            creatorName
            description
            tags
            photo
        }
    }
`;
export const EDIT_USER = gql`
    mutation SaveChanges(
        $username: String!
        $name: String!
        $email: String!
        $profilePicture: String!
    ) {
        saveChanges(username: $username, email: $email, name: $name, profilePicture: $profilePicture)

    }
`;

export const REGISTER_USER = gql`
    mutation createUser(
        $username: String!
        $email: String!
        $name: String!
        $password: String!
    ) {
        createUser(
            username: $username
            email: $email
            name: $name
            password: $password
        ) {
            username
            email
            name
            token
        }
    }
`
;