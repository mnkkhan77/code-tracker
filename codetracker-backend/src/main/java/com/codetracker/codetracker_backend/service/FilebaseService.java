package com.codetracker.codetracker_backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.net.URI;
import java.time.Duration;

@Slf4j
@Service
public class FilebaseService {

    private static final URI ENDPOINT = URI.create("https://s3.filebase.com");
    private static final Region REGION = Region.of("us-east-1");

    private final S3Client s3;
    private final S3Presigner presigner;
    private final String bucket;

    public FilebaseService(
            @Value("${filebase.access-key}") String accessKey,
            @Value("${filebase.secret-key}") String secretKey,
            @Value("${filebase.bucket}") String bucket) {

        this.bucket = bucket;

        StaticCredentialsProvider creds = StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey));

        this.s3 = S3Client.builder()
                .endpointOverride(ENDPOINT)
                .region(REGION)
                .credentialsProvider(creds)
                .build();

        this.presigner = S3Presigner.builder()
                .endpointOverride(ENDPOINT)
                .region(REGION)
                .credentialsProvider(creds)
                .build();
    }

    /**
     * Uploads bytes to Filebase and returns the object key.
     */
    public String upload(String key, byte[] bytes, String contentType) {
        s3.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(contentType)
                        .contentLength((long) bytes.length)
                        .build(),
                RequestBody.fromBytes(bytes));
        log.info("[Filebase] Uploaded: {}", key);
        return key;
    }

    /**
     * Deletes an object from Filebase by key.
     */
    public void delete(String key) {
        s3.deleteObject(
                DeleteObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .build());
        log.info("[Filebase] Deleted: {}", key);
    }

    /**
     * Returns a time-limited presigned URL for downloading an object.
     */
    public String presignedUrl(String key, Duration ttl) {
        return presigner.presignGetObject(
                GetObjectPresignRequest.builder()
                        .signatureDuration(ttl)
                        .getObjectRequest(r -> r.bucket(bucket).key(key))
                        .build()
        ).url().toString();
    }
}
