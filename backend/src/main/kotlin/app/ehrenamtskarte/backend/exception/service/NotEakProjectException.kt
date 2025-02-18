package app.ehrenamtskarte.backend.exception.service

class NotEakProjectException() : Exception("This query can only be used for EAK project")

class NotKoblenzProjectException() : Exception("This query can only be used for Koblenz project")
