/*
 Navicat PostgreSQL Data Transfer

 Source Server         : home
 Source Server Type    : PostgreSQL
 Source Server Version : 140005 (140005)
 Source Host           : localhost:5432
 Source Catalog        : kitty
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 140005 (140005)
 File Encoding         : 65001

 Date: 09/09/2022 12:53:37
*/


-- ----------------------------
-- Sequence structure for contacts_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."contacts_id_seq";
CREATE SEQUENCE "public"."contacts_id_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."contacts_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Table structure for contacts
-- ----------------------------
DROP TABLE IF EXISTS "public"."contacts";
CREATE TABLE "public"."contacts" (
  "id" int4 NOT NULL DEFAULT nextval('contacts_id_seq'::regclass),
  "contact_name" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "contact_email" varchar COLLATE "pg_catalog"."default" NOT NULL
)
;
ALTER TABLE "public"."contacts" OWNER TO "postgres";

-- ----------------------------
-- Records of contacts
-- ----------------------------
BEGIN;
INSERT INTO "public"."contacts" ("id", "contact_name", "contact_email") VALUES (7, 'r543 Itrerwqem32', 'rf sdfIrtemqqwwer');
INSERT INTO "public"."contacts" ("id", "contact_name", "contact_email") VALUES (8, '65', 'N12344321423w 41234312412');
INSERT INTO "public"."contacts" ("id", "contact_name", "contact_email") VALUES (9, 'vighneshbheed@outlook.com', 'q31rsdfsdf');
INSERT INTO "public"."contacts" ("id", "contact_name", "contact_email") VALUES (10, 'New wqewqcyxcy', 'New Item');
COMMIT;

-- ----------------------------
-- Table structure for drafts
-- ----------------------------
DROP TABLE IF EXISTS "public"."drafts";
CREATE TABLE "public"."drafts" (
  "username" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "draft" varchar COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."drafts" OWNER TO "postgres";

-- ----------------------------
-- Records of drafts
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "username" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar COLLATE "pg_catalog"."default" NOT NULL
)
;
ALTER TABLE "public"."users" OWNER TO "postgres";

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO "public"."users" ("username", "password") VALUES ('5da10e05722dbc', '527a3fbfb41332');
COMMIT;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."contacts_id_seq"
OWNED BY "public"."contacts"."id";
SELECT setval('"public"."contacts_id_seq"', 10, true);

-- ----------------------------
-- Primary Key structure for table contacts
-- ----------------------------
ALTER TABLE "public"."contacts" ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");