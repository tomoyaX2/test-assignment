import { Injectable } from '@nestjs/common';
import {
  S3,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private s3Client: S3;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3({
      endpoint: configService.get('S3_ENDPOINT'),
      region: configService.get('S3_REGION'),
      credentials: {
        accessKeyId: configService.get('SPACES_KEY'),
        secretAccessKey: configService.get('SPACES_SECRET'),
      },
    });

    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');
  }

  async uploadUserAvatar(file: Express.Multer.File, userId: string) {
    try {
      const imageUrl = `users/${userId}/avatar-${uuidv4()}.png`;

      const bucketParams: PutObjectCommandInput = {
        Bucket: this.bucketName,
        Key: imageUrl,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };

      await this.s3Client.send(new PutObjectCommand(bucketParams));

      return imageUrl;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('Failed to upload file');
    }
  }
}
