const AWS = require( 'aws-sdk' );
const AmazonCognitoIdentity = require( 'amazon-cognito-identity-js' ) ;
// const request = require('request');
// const jwkToPem = require( 'jwt-to-pem' ) ;
// const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

var dgbtest1PoolData = { UserPoolId: 'eu-west-2_o0ipQnkr8'
                       , ClientId: '1nfvihsr2h30832o7k5deevrok'
                       } ; 
var dgbtestPoolData = { UserPoolId: 'eu-west-2_o0ipQnkr8'
                   , ClientId: '2p5jopg3cd08dt994f24oj14jd'
                   } ;

var meaniesPoolData = { UserPoolId : 'eu-west-2_99e6gT0eQ'      // your user pool id here
                      , ClientId : '4re7epkodafhhsmpq10lrombqq' // your app client id here
                      };

const pool_region = 'eu-west-2' ;

const userPool = new AmazonCognitoIdentity.CognitoUserPool(meaniesPoolData);

var meaniesUser = { Username: 'Dave.Butland', Password: 'Th3Muppet$h0w' } ;
// var dgbtestUser = { Username: 'test-user-1@dgbutland.onmicrosoft.com', Password: 'Th3Muppet$h0w' } ;

var authenticationData = meaniesUser ;

var userData = {
    Username : authenticationData.Username, 
    Pool : userPool
};

var attributeList = [];
 
var dataEmail = {
    Name : 'email',
    Value : 'dgbutland@gmail.com' // your email here
};
var dataPhoneNumber = {
    Name : 'phone_number',
    Value : '+447976814351' // your phone number here with +country code and no delimiters in front
};
var dataGivenName = {
    Name : 'given_name',
    Value : 'Dave' // your given name
};
var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);
var attributeGivenName = new AmazonCognitoIdentity.CognitoUserAttribute(dataGivenName);
 
attributeList.push(attributeEmail);
attributeList.push(attributePhoneNumber);
attributeList.push(attributeGivenName);
 
var cognitoUser;

/*
userPool.signUp(authenticationData.Username, authenticationData.Password, attributeList, null, function(err, result){
    if (err) {
        console.log(err);
        return;
    }
    cognitoUser = result.user;
    console.log('user name is ' + cognitoUser.getUsername());
});
*/

var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails( authenticationData ) ;

/*
cognitoUser.confirmRegistration('339128', true, function(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('call result: ' + result);
});
*/

cognitoUser.authenticateUser( authenticationDetails, { 
    onSuccess: function(result){
        var accessToken = result.accessToken.jwtToken ;
        var idToken = result.idToken.jwtToken;
        var refreshToken = result.refreshToken.token;

        console.log( "Access Token: " + accessToken ) ;
        console.log( "Id Token: " + idToken ) ;
        console.log( "Refresh Token: " + refreshToken ) ;
    },
    onFailure: function(err){
        console.log(err) ;
    },
    mfaRequired: function(codeDeliveryDetails){
        console.log(codeDeliveryDetails)
        var verificationCode = prompt('Please input verification code','');
        congnitoUser.sendMFACode(verificationCode, this);
    }
});
