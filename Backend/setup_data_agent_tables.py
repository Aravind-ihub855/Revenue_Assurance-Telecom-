import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DIRECT_URL")

def setup_telecom_tables():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    # Create CDR Table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS cdr (
            cdr_id VARCHAR(50) PRIMARY KEY,
            customer_id VARCHAR(50),
            msisdn VARCHAR(20),
            imsi VARCHAR(50),
            imei VARCHAR(50),
            event_type VARCHAR(20),
            call_type VARCHAR(20),
            direction VARCHAR(10),
            event_start_time TIMESTAMP,
            event_end_time TIMESTAMP,
            event_date DATE,
            event_hour INT,
            duration_seconds INT,
            data_volume_uplink_bytes BIGINT,
            data_volume_downlink_bytes BIGINT,
            sms_count INT,
            destination_number VARCHAR(20),
            network_type VARCHAR(20),
            roaming_flag BOOLEAN,
            cell_id VARCHAR(50),
            location_area VARCHAR(50),
            switch_id VARCHAR(50),
            apn VARCHAR(50),
            qos_class VARCHAR(20),
            session_id VARCHAR(50),
            source_system VARCHAR(50),
            record_status VARCHAR(20),
            checksum VARCHAR(100),
            inter_operator_flag BOOLEAN,
            batch_id VARCHAR(50),
            error_reason TEXT
        )
    """)
    
    # Create SMS Detail Table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS sms_detail (
            sms_detail_id VARCHAR(50) PRIMARY KEY,
            cdr_id VARCHAR(50),
            customer_id VARCHAR(50),
            sms_type VARCHAR(20),
            destination_msisdn VARCHAR(20),
            sms_category VARCHAR(20),
            is_premium_sms BOOLEAN,
            segment_count INT,
            delivery_status VARCHAR(20),
            operator_charge DECIMAL(10,2),
            created_at TIMESTAMP,
            record_status VARCHAR(20),
            batch_id VARCHAR(50),
            error_reason TEXT
        )
    """)
    
    # Create Data Session Table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS data_session (
            session_detail_id VARCHAR(50) PRIMARY KEY,
            cdr_id VARCHAR(50),
            customer_id VARCHAR(50),
            session_id VARCHAR(50),
            upload_bytes BIGINT,
            download_bytes BIGINT,
            total_bytes BIGINT,
            session_mb DECIMAL(10,4),
            normal_mb DECIMAL(10,4),
            overage_mb DECIMAL(10,4),
            apn VARCHAR(50),
            network_type VARCHAR(20),
            qos_class VARCHAR(20),
            fup_triggered BOOLEAN,
            throttled_flag BOOLEAN,
            session_start_time TIMESTAMP,
            session_end_time TIMESTAMP,
            cell_id VARCHAR(50),
            created_at TIMESTAMP,
            record_status VARCHAR(20),
            batch_id VARCHAR(50),
            error_reason TEXT
        )
    """)
    
    # Create Data Agent Batches
    cur.execute("""
        CREATE TABLE IF NOT EXISTS data_agent_batches (
            batch_id VARCHAR(50) PRIMARY KEY,
            target_type VARCHAR(20),
            file_name VARCHAR(255),
            total_records INT,
            valid_records INT,
            rejected_records INT,
            duplicate_records INT,
            valid_percentage DECIMAL(5,2),
            status VARCHAR(20) DEFAULT 'completed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    cur.close()
    conn.close()
    print("Successfully created/updated CDR, SMS Detail, Data Session, and Batch tables with tracking columns.")

if __name__ == "__main__":
    setup_telecom_tables()
