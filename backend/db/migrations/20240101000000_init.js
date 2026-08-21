/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Create ENUMs for PostgreSQL
  await knex.raw(`
    DO $$ BEGIN
      CREATE TYPE "Role" AS ENUM ('CITIZEN', 'ADMIN', 'SUPER_ADMIN', 'PARTNER');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    
    DO $$ BEGIN
      CREATE TYPE "SchemeStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "SchemeOrigin" AS ENUM ('SCRAPED', 'ADMIN_MODIFIED');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "ScraperJobStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "Language" AS ENUM ('ENGLISH', 'HINDI', 'OTHER');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await knex.schema
    .createTable('User', (table) => {
      table.string('id').primary();
      table.string('name').notNullable();
      table.string('mobile').unique().notNullable();
      table.string('email').unique();
      table.string('passwordHash').notNullable();
      table.specificType('role', '"Role"').defaultTo('CITIZEN').notNullable();
      table.boolean('isActive').defaultTo(true).notNullable();
      table.timestamp('lastActiveAt');
      table.specificType('language', '"Language"').defaultTo('ENGLISH').notNullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('CitizenProfile', (table) => {
      table.string('id').primary();
      table.string('userId').unique().notNullable().references('id').inTable('User').onDelete('CASCADE');
      table.integer('age');
      table.string('gender');
      table.string('state');
      table.string('district');
      table.string('occupation');
      table.string('income');
      table.string('education');
      table.string('category');
      table.string('disability');
      table.text('familyDetails');
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('Scheme', (table) => {
      table.string('id').primary();
      table.string('name').notNullable();
      table.text('description').notNullable();
      table.string('department');
      table.string('category');
      table.string('state');
      table.text('eligibility');
      table.text('benefits');
      table.text('documentsRequired');
      table.string('applicationLink');
      table.string('sourceUrl');
      table.specificType('status', '"SchemeStatus"').defaultTo('ACTIVE').notNullable();
      table.specificType('origin', '"SchemeOrigin"').defaultTo('SCRAPED').notNullable();
      table.string('contentHash');
      table.timestamp('lastScrapedAt');
      table.timestamp('indexedAt');
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('SchemeSource', (table) => {
      table.string('id').primary();
      table.string('url').notNullable();
      table.string('title');
      table.string('state');
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('SchemeCategory', (table) => {
      table.string('id').primary();
      table.string('name').unique().notNullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('SchemeDocument', (table) => {
      table.string('id').primary();
      table.string('schemeId').notNullable().references('id').inTable('Scheme').onDelete('CASCADE');
      table.string('name').notNullable();
      table.boolean('required').defaultTo(true).notNullable();
    })
    .createTable('Application', (table) => {
      table.string('id').primary();
      table.string('userId').notNullable().references('id').inTable('User').onDelete('CASCADE');
      table.string('schemeId').notNullable().references('id').inTable('Scheme').onDelete('CASCADE');
      table.specificType('status', '"ApplicationStatus"').defaultTo('DRAFT').notNullable();
      table.timestamp('submittedDate');
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('ChatSession', (table) => {
      table.string('id').primary();
      table.string('userId').notNullable().references('id').inTable('User').onDelete('CASCADE');
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('ChatMessage', (table) => {
      table.string('id').primary();
      table.string('sessionId').notNullable().references('id').inTable('ChatSession').onDelete('CASCADE');
      table.string('role').notNullable();
      table.text('content').notNullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('ScraperLog', (table) => {
      table.string('id').primary();
      table.string('sourceUrl').notNullable();
      table.string('status').notNullable();
      table.text('meta');
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('ScraperJob', (table) => {
      table.string('id').primary();
      table.string('queueJobId').unique();
      table.string('sourceUrl').notNullable();
      table.string('sourceName');
      table.specificType('status', '"ScraperJobStatus"').defaultTo('QUEUED').notNullable();
      table.timestamp('startedAt');
      table.timestamp('completedAt');
      table.integer('pagesProcessed').defaultTo(0).notNullable();
      table.integer('pagesFailed').defaultTo(0).notNullable();
      table.integer('schemesDiscovered').defaultTo(0).notNullable();
      table.integer('newSchemes');
      table.integer('updatedSchemes');
      table.integer('failedItems').defaultTo(0).notNullable();
      table.text('error');
      table.integer('retryCount').defaultTo(0).notNullable();
      table.string('triggeredBy');
      table.string('requestId');
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('Notification', (table) => {
      table.string('id').primary();
      table.string('userId').notNullable().references('id').inTable('User').onDelete('CASCADE');
      table.string('title').notNullable();
      table.text('body').notNullable();
      table.boolean('read').defaultTo(false).notNullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('AuditLog', (table) => {
      table.string('id').primary();
      table.string('action').notNullable();
      table.string('entity').notNullable();
      table.string('entityId');
      table.text('details');
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema
    .dropTableIfExists('AuditLog')
    .dropTableIfExists('Notification')
    .dropTableIfExists('ScraperJob')
    .dropTableIfExists('ScraperLog')
    .dropTableIfExists('ChatMessage')
    .dropTableIfExists('ChatSession')
    .dropTableIfExists('Application')
    .dropTableIfExists('SchemeDocument')
    .dropTableIfExists('SchemeCategory')
    .dropTableIfExists('SchemeSource')
    .dropTableIfExists('Scheme')
    .dropTableIfExists('CitizenProfile')
    .dropTableIfExists('User');
    
  await knex.raw(`
    DROP TYPE IF EXISTS "Role";
    DROP TYPE IF EXISTS "SchemeStatus";
    DROP TYPE IF EXISTS "SchemeOrigin";
    DROP TYPE IF EXISTS "ScraperJobStatus";
    DROP TYPE IF EXISTS "ApplicationStatus";
    DROP TYPE IF EXISTS "Language";
  `);
};
