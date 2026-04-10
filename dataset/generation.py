import pandas as pd
import numpy as np
import random
import uuid
from datetime import datetime, timedelta, date
import os
import hashlib

# ─────────────────────────────────────────────
# FIX #6: Reproducible seed
# ─────────────────────────────────────────────
random.seed(42)
np.random.seed(42)

OUTPUT_DIR = "/home/claude/ra_dataset"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────
_uid_counter = 0
def uid():
    global _uid_counter
    _uid_counter += 1
    return str(uuid.UUID(int=_uid_counter + random.getrandbits(64)))[:12].upper()

def rand_msisdn():
    prefixes = ["91700","91701","91702","91703","91704","91705","91706",
                "91800","91801","91900","91901","91990"]
    return random.choice(prefixes) + str(random.randint(10000, 99999))

def rand_ts(start: datetime, end: datetime) -> datetime:
    delta = end - start
    return start + timedelta(seconds=random.randint(0, int(delta.total_seconds())))

def rand_date(start: date, end: date) -> date:
    delta = (end - start).days
    return start + timedelta(days=random.randint(0, max(delta, 0)))

CIRCLES  = ["Tamil Nadu","Maharashtra","Karnataka","Delhi","Gujarat",
            "Rajasthan","UP East","UP West","West Bengal","Andhra Pradesh"]
NAMES_M  = ["Arjun","Rahul","Vikram","Karthik","Suresh","Ramesh","Ajay",
            "Deepak","Manoj","Sanjay","Arun","Prakash","Vijay","Ravi","Anand"]
NAMES_F  = ["Priya","Deepa","Kavitha","Sunita","Ananya","Meena","Rekha",
            "Shilpa","Pooja","Divya","Lakshmi","Radha","Neha","Anjali","Swathi"]
SURNAMES = ["Kumar","Sharma","Singh","Patel","Reddy","Nair","Iyer",
            "Gupta","Joshi","Verma","Shah","Mehta","Das","Rao","Pillai"]
DEVICES  = ["smartphone","smartphone","smartphone","feature","IoT","smartphone","smartphone"]

NETWORK_ELEMENTS = ["MSC-BLR-01","MSC-MUM-02","GGSN-DEL-01","PGW-CHE-01","MME-HYD-01"]
CELL_IDS  = [f"CELL{str(i).zfill(4)}" for i in range(1, 201)]
SWITCHES  = [f"SW{str(i).zfill(3)}"   for i in range(1, 21)]

# ─────────────────────────────────────────────
# 1. TARIFF PLAN  (24 real Jio-based plans)
# ─────────────────────────────────────────────
print("Generating tariff_plan...")

plans_raw = [
    # plan_id, plan_name, plan_category, account_type, plan_price, validity_days, validity_type,
    # voice_unlimited, free_voice_local_min, free_voice_std_min, free_voice_isd_min,
    # daily_data_mb, free_sms_per_day, free_sms_total, post_fup_speed_kbps,
    # is_unlimited, is_5g, is_data_only, roaming_included, overage_rate_per_gb

    # ── PREPAID 1 GB/day ──
    ("PLN001","Jio Basic 149",    "prepaid","consumer",  149, 20,"days",True,99999,99999,0,1024,  100,2000, 64,False,False,False,False,10),
    ("PLN002","Jio Smart 209",    "prepaid","consumer",  209, 22,"days",True,99999,99999,0,1024,  100,2200, 64,False,False,False,False,10),
    ("PLN003","Jio Value 249",    "prepaid","consumer",  249, 28,"days",True,99999,99999,0,1024,  100,2800, 64,False,False,False,False,10),
    # ── PREPAID 1.5 GB/day ──
    ("PLN004","Jio Plus 299",     "prepaid","consumer",  299, 28,"days",True,99999,99999,0,1536,  100,2800, 64,False,False,False,False,10),
    ("PLN005","Jio Plus 579",     "prepaid","consumer",  579, 56,"days",True,99999,99999,0,1536,  100,5600, 64,False,False,False,False,10),
    ("PLN006","Jio Plus 799",     "prepaid","consumer",  799, 84,"days",True,99999,99999,0,1536,  100,8400, 64,False,False,False,False,10),
    # ── PREPAID 2 GB/day (True 5G) ──
    ("PLN007","Jio 5G 349",       "prepaid","consumer",  349, 28,"days",True,99999,99999,0,2048,  100,2800, 64,False,True, False,False,10),
    ("PLN008","Jio 5G 629",       "prepaid","consumer",  629, 56,"days",True,99999,99999,0,2048,  100,5600, 64,False,True, False,False,10),
    ("PLN009","Jio 5G 719",       "prepaid","consumer",  719, 70,"days",True,99999,99999,0,2048,  100,7000, 64,False,True, False,False,10),
    ("PLN010","Jio 5G 859",       "prepaid","consumer",  859, 84,"days",True,99999,99999,0,2048,  100,8400, 64,False,True, False,False,10),
    ("PLN011","Jio 5G 899",       "prepaid","consumer",  899, 90,"days",True,99999,99999,0,2048,  100,9000, 64,False,True, False,False,10),
    # ── PREPAID 2.5 GB/day (True 5G) ──
    ("PLN012","Jio Ultra 399",    "prepaid","consumer",  399, 28,"days",True,99999,99999,0,2560,  100,2800, 64,False,True, False,False,10),
    ("PLN013","Jio Annual 3599",  "prepaid","consumer", 3599,365,"days",True,99999,99999,0,2560,  100,36500,64,False,True, False,False,10),
    # ── PREPAID ANNUAL ──
    ("PLN014","Jio Annual 2399",  "prepaid","consumer", 2399,365,"days",True,99999,99999,0,2048,  100,36500,64,False,True, False,False,10),
    # ── PREPAID VOICE ONLY ──
    ("PLN015","Jio Voice 448",    "prepaid","consumer",  448, 84,"days",True,99999,99999,0,0,       0,1000,  0,False,False,False,False, 0),
    ("PLN016","Jio Freedom 355",  "prepaid","consumer",  355, 30,"days",True,99999,99999,0,25600, 100,3000, 64,False,False,False,False,10),
    # ── PREPAID DATA ONLY ──
    ("PLN017","Jio Data 151",     "prepaid","consumer",  151, 30,"days",False,0,0,0,              10240,   0,0,64,False,False,True, False,10),
    ("PLN018","Jio Data 301",     "prepaid","consumer",  301, 30,"days",False,0,0,0,              20480,   0,0,64,False,False,True, False,10),
    # ── POSTPAID INDIVIDUAL ──
    ("PLN019","JioPlus Indiv 349","postpaid","consumer", 349,-1,"billing_cycle",True,99999,99999,0,30720,  100,-1,0,False,True, False,False,10),
    ("PLN020","JioPlus Indiv 649","postpaid","consumer", 649,-1,"billing_cycle",True,99999,99999,0,-1,     100,-1,0,True, True, False,False,10),
    ("PLN021","JioPlus Indiv 1549","postpaid","consumer",1549,-1,"billing_cycle",True,99999,99999,0,307200,100,-1,0,False,True, False,False,10),
    # ── POSTPAID FAMILY ──
    ("PLN022","JioPlus Family 449","postpaid","consumer",449,-1,"billing_cycle",True,99999,99999,0,76800,  100,-1,0,False,True, False,False,10),
    ("PLN023","JioPlus Family 749","postpaid","consumer",749,-1,"billing_cycle",True,99999,99999,0,102400, 100,-1,0,False,True, False,False,10),
    # ── INTERNATIONAL ROAMING ──
    ("PLN024","Jio IR Pack 1102", "prepaid","consumer", 1102, 28,"days",True,99999,99999,100,2048, 100,2800,64,False,True, False,True, 20),
]

plan_cols = [
    "plan_id","plan_name","plan_category","account_type","plan_price","validity_days","validity_type",
    "voice_unlimited_flag","free_voice_local_min","free_voice_std_min","free_voice_isd_min",
    "daily_data_mb","free_sms_per_day","free_sms_total","post_fup_speed_kbps",
    "is_unlimited_plan","is_5g_plan","is_data_only_plan","roaming_included","overage_rate_per_gb"
]

df_plan = pd.DataFrame(plans_raw, columns=plan_cols)
df_plan["effective_from"] = date(2024, 1, 1)
df_plan["effective_to"]   = None
df_plan["created_at"]     = datetime(2024, 1, 1, 9, 0, 0)
df_plan["updated_at"]     = datetime(2024, 1, 1, 9, 0, 0)

plan_lookup = df_plan.set_index("plan_id").to_dict("index")

# ─────────────────────────────────────────────
# 2. TARIFF RATE
# ─────────────────────────────────────────────
print("Generating tariff_rate...")

rate_rows = []
for _, p in df_plan.iterrows():
    pid = p["plan_id"]

    # voice local
    rate_rows.append({
        "rate_id": uid(), "plan_id": pid,
        "event_type": "voice", "call_type": "local",
        "direction": "MO", "roaming_zone": None,
        "network_type": "4G",
        "rate_per_unit": 0.0 if p["voice_unlimited_flag"] else round(1.0/60, 6),
        "charging_unit": "per_second", "pulse_seconds": 1,
        "free_unit_applicable": True, "free_unit_type": "minutes",
        "overage_rate": 0.0, "is_unlimited": p["voice_unlimited_flag"],
        "tax_rate_percent": 18.0,
        "effective_from": date(2024, 1, 1), "effective_to": None,
        "created_at": datetime(2024, 1, 1, 9, 0, 0),
    })

    # voice STD
    rate_rows.append({
        "rate_id": uid(), "plan_id": pid,
        "event_type": "voice", "call_type": "STD",
        "direction": "MO", "roaming_zone": None,
        "network_type": "4G",
        "rate_per_unit": 0.0 if p["voice_unlimited_flag"] else round(1.5/60, 6),
        "charging_unit": "per_second", "pulse_seconds": 1,
        "free_unit_applicable": True, "free_unit_type": "minutes",
        "overage_rate": 0.0, "is_unlimited": p["voice_unlimited_flag"],
        "tax_rate_percent": 18.0,
        "effective_from": date(2024, 1, 1), "effective_to": None,
        "created_at": datetime(2024, 1, 1, 9, 0, 0),
    })

    # SMS national
    sms_rate = 0.0 if p["free_sms_per_day"] > 0 else 1.0
    rate_rows.append({
        "rate_id": uid(), "plan_id": pid,
        "event_type": "sms", "call_type": "national",
        "direction": "MO", "roaming_zone": None,
        "network_type": "4G",
        "rate_per_unit": sms_rate,
        "charging_unit": "per_sms", "pulse_seconds": 1,
        "free_unit_applicable": True, "free_unit_type": "sms",
        "overage_rate": 0.0, "is_unlimited": (p["free_sms_per_day"] > 0),
        "tax_rate_percent": 18.0,
        "effective_from": date(2024, 1, 1), "effective_to": None,
        "created_at": datetime(2024, 1, 1, 9, 0, 0),
    })

    # data / internet
    overage = p["overage_rate_per_gb"] / 1024.0 if p["overage_rate_per_gb"] > 0 else 0.0
    rate_rows.append({
        "rate_id": uid(), "plan_id": pid,
        "event_type": "data", "call_type": "internet",
        "direction": "MO", "roaming_zone": None,
        "network_type": "4G/5G" if p["is_5g_plan"] else "4G",
        "rate_per_unit": 0.0 if p["daily_data_mb"] > 0 else round(0.5/1024, 6),
        "charging_unit": "per_mb", "pulse_seconds": 1,
        "free_unit_applicable": True, "free_unit_type": "mb",
        "overage_rate": overage, "is_unlimited": bool(p["is_unlimited_plan"]),
        "tax_rate_percent": 18.0,
        "effective_from": date(2024, 1, 1), "effective_to": None,
        "created_at": datetime(2024, 1, 1, 9, 0, 0),
    })

df_rate = pd.DataFrame(rate_rows)

# ─────────────────────────────────────────────
# 3. CUSTOMER  (200 rows)
# ─────────────────────────────────────────────
print("Generating customer...")

prepaid_plans  = df_plan[df_plan["plan_category"] == "prepaid"]["plan_id"].tolist()
postpaid_plans = df_plan[df_plan["plan_category"] == "postpaid"]["plan_id"].tolist()

customers = []
for i in range(200):
    is_female  = random.random() < 0.45
    fname      = random.choice(NAMES_F if is_female else NAMES_M)
    lname      = random.choice(SURNAMES)
    acct_type  = random.choices(["prepaid","postpaid"], weights=[60, 40])[0]
    plan_id    = random.choice(prepaid_plans if acct_type == "prepaid" else postpaid_plans)
    status     = random.choices(["active","suspended","churned"], weights=[85, 10, 5])[0]
    cid        = f"CUST{str(i+1).zfill(5)}"
    act_date   = rand_date(date(2020, 1, 1), date(2023, 6, 30))
    deact_date = rand_date(date(2023, 7, 1), date(2024, 3, 31)) if status == "churned" else None
    customers.append({
        "customer_id":              cid,
        "msisdn":                   rand_msisdn(),
        "name":                     f"{fname} {lname}",
        "email":                    f"{fname.lower()}.{lname.lower()}{random.randint(1,99)}@gmail.com",
        "gender":                   "F" if is_female else "M",
        "account_type":             acct_type,
        "location_telecom_circle":  random.choice(CIRCLES),
        "device_type":              random.choice(DEVICES),
        "billing_cycle_day":        random.choice([1, 5, 10, 15, 20, 25]),
        "credit_limit":             round(random.uniform(500, 5000), 2) if acct_type == "postpaid" else None,
        "plan_id":                  plan_id,
        "account_status":           status,
        "activation_date":          act_date,
        "deactivation_date":        deact_date,
        "created_at":               datetime.combine(act_date, datetime.min.time()),
    })

df_cust = pd.DataFrame(customers)

# ─────────────────────────────────────────────
# 4. CUSTOMER PLAN HISTORY
# ─────────────────────────────────────────────
print("Generating customer_plan_history...")

plan_hist = []
for _, c in df_cust.iterrows():
    cid      = c["customer_id"]
    acct     = c["account_type"]
    pool     = prepaid_plans if acct == "prepaid" else postpaid_plans
    cur_plan = c["plan_id"]
    act_date = c["activation_date"]

    changed = random.random() < 0.15
    if changed:
        old_plan    = random.choice([p for p in pool if p != cur_plan] or pool)
        change_date = rand_date(date(2024, 1, 1), date(2024, 2, 15))
        expiry_old  = change_date - timedelta(days=1)
        plan_hist.append({
            "plan_history_id":  uid(),
            "customer_id":      cid,
            "plan_id":          old_plan,
            "activation_date":  act_date,
            "expiry_date":      expiry_old,
            "plan_status":      "expired",
            "change_type":      "new_activation",
            "previous_plan_id": None,
            "auto_renewal_flag":True,
            "recharge_amount":  df_plan.loc[df_plan.plan_id == old_plan, "plan_price"].values[0],
            "recharge_type":    random.choice(["online","store","app"]),
            "source_channel":   random.choice(["MyJio","JioMart","store"]),
            "is_current_plan":  False,
            "created_at":       datetime.combine(act_date, datetime.min.time()),
            "updated_at":       datetime.combine(change_date, datetime.min.time()),
        })
        plan_hist.append({
            "plan_history_id":  uid(),
            "customer_id":      cid,
            "plan_id":          cur_plan,
            "activation_date":  change_date,
            "expiry_date":      None,
            "plan_status":      "active",
            "change_type":      random.choice(["upgrade","downgrade","renewal"]),
            "previous_plan_id": old_plan,
            "auto_renewal_flag":True,
            "recharge_amount":  df_plan.loc[df_plan.plan_id == cur_plan, "plan_price"].values[0],
            "recharge_type":    random.choice(["online","store","app"]),
            "source_channel":   random.choice(["MyJio","JioMart","store"]),
            "is_current_plan":  True,
            "created_at":       datetime.combine(change_date, datetime.min.time()),
            "updated_at":       datetime.combine(change_date, datetime.min.time()),
        })
    else:
        plan_hist.append({
            "plan_history_id":  uid(),
            "customer_id":      cid,
            "plan_id":          cur_plan,
            "activation_date":  act_date,
            "expiry_date":      None,
            "plan_status":      "active",
            "change_type":      "new_activation",
            "previous_plan_id": None,
            "auto_renewal_flag":True,
            "recharge_amount":  df_plan.loc[df_plan.plan_id == cur_plan, "plan_price"].values[0],
            "recharge_type":    random.choice(["online","store","app"]),
            "source_channel":   random.choice(["MyJio","JioMart","store"]),
            "is_current_plan":  True,
            "created_at":       datetime.combine(act_date, datetime.min.time()),
            "updated_at":       datetime.combine(act_date, datetime.min.time()),
        })

df_planhist = pd.DataFrame(plan_hist)

# ─────────────────────────────────────────────
# PLAN HISTORY LOOKUP HELPER
# ─────────────────────────────────────────────
# Build a fast dict: customer_id → sorted list of (activation_date, expiry_date, plan_id)
planhist_by_cust = {}
for _, r in df_planhist.iterrows():
    cid = r["customer_id"]
    if cid not in planhist_by_cust:
        planhist_by_cust[cid] = []
    planhist_by_cust[cid].append((r["activation_date"], r["expiry_date"], r["plan_id"]))

# Sort each by activation_date ascending
for cid in planhist_by_cust:
    planhist_by_cust[cid].sort(key=lambda x: x[0])

cust_default_plan = df_cust.set_index("customer_id")["plan_id"].to_dict()

def get_plan_on_date(customer_id: str, event_date: date) -> str:
    """Return the plan active on event_date for this customer. O(k) per call."""
    rows = planhist_by_cust.get(customer_id, [])
    for (act_date, exp_date, plan_id) in rows:
        if isinstance(act_date, date) and act_date <= event_date:
            if exp_date is None or exp_date >= event_date:
                return plan_id
    return cust_default_plan.get(customer_id, prepaid_plans[0])

# ─────────────────────────────────────────────
# 5. BILLING CYCLE  (3 months Jan–Mar 2024)
# ─────────────────────────────────────────────
print("Generating billing_cycle...")

cycles = []
active_custs = df_cust[df_cust["account_status"].isin(["active","suspended"])].copy()

for _, c in active_custs.iterrows():
    bday = c["billing_cycle_day"]
    for month_num in [1, 2, 3]:
        try:
            cs = date(2024, month_num, bday)
        except ValueError:
            cs = date(2024, month_num, 28)
        nm = month_num + 1 if month_num < 12 else 1
        ny = 2024 if month_num < 12 else 2025
        try:
            ce = date(ny, nm, bday) - timedelta(days=1)
        except ValueError:
            ce = date(ny, nm, 28) - timedelta(days=1)

        bill_gen = cs + timedelta(days=1)
        due      = bill_gen + timedelta(days=15)
        bstatus  = random.choices(["generated","paid","disputed"], weights=[70, 25, 5])[0]
        pstatus  = "paid" if bstatus == "paid" else random.choices(["unpaid","overdue"], weights=[70, 30])[0]
        pdate    = rand_date(bill_gen, due + timedelta(days=5)) if bstatus == "paid" else None
        cycles.append({
            "cycle_id":             uid(),
            "customer_id":          c["customer_id"],
            "billing_cycle_day":    bday,
            "cycle_start_date":     cs,
            "cycle_end_date":       ce,
            "bill_generation_date": bill_gen,
            "billing_status":       bstatus,
            "total_amount":         0.0,   # filled later after billing_record generation
            "due_date":             due,
            "payment_status":       pstatus,
            "payment_date":         pdate,
            "late_fee":             round(random.uniform(10, 50), 2) if pstatus == "overdue" else 0.0,
            "adjustment_amount":    0.0,
            "created_at":           datetime.combine(bill_gen, datetime.min.time()),
            "updated_at":           datetime.combine(bill_gen, datetime.min.time()),
        })

df_cycle = pd.DataFrame(cycles)
# ensure cycle_ids are unique (reset any collision)
df_cycle["cycle_id"] = [f"CYC{str(i).zfill(6)}" for i in range(len(df_cycle))]

# ─────────────────────────────────────────────
# 6. CDR  (~15 000 rows)
#    FIX #4: Add event_date + event_hour columns
# ─────────────────────────────────────────────
print("Generating CDR (this takes a moment)...")

cdrs = []

# FIX #2: per-cycle free usage state — (customer_id, cycle_id) → {data_mb, sms, voice_min}
# Initialise when we first encounter each (cust, cycle) pair
free_usage_state = {}   # key: (cid, cyc_id) → {"data_mb": float, "sms": int, "voice_min": float}

for _, c in active_custs.iterrows():
    cid    = c["customer_id"]
    msisdn = c["msisdn"]

    cust_cycles = df_cycle[df_cycle["customer_id"] == cid]

    for _, cyc in cust_cycles.iterrows():
        cyc_id = cyc["cycle_id"]
        cs_dt  = datetime.combine(cyc["cycle_start_date"], datetime.min.time())
        ce_dt  = datetime.combine(cyc["cycle_end_date"],   datetime.max.time())

        n_cdrs = random.randint(25, 55)

        # FIX #2: initialise per-cycle free-usage tracker
        if (cid, cyc_id) not in free_usage_state:
            plan_id_init = get_plan_on_date(cid, cyc["cycle_start_date"])
            plan_init    = plan_lookup.get(plan_id_init, list(plan_lookup.values())[0])
            cycle_days   = (cyc["cycle_end_date"] - cyc["cycle_start_date"]).days + 1
            free_usage_state[(cid, cyc_id)] = {
                "data_mb":   plan_init["daily_data_mb"] * cycle_days,   # total free MB for cycle
                "sms":       plan_init["free_sms_total"] if plan_init["free_sms_total"] > 0 else
                             plan_init["free_sms_per_day"] * cycle_days,
                "voice_min": plan_init["free_voice_local_min"],         # effectively unlimited if flag set
                "data_mb_remaining":  plan_init["daily_data_mb"] * cycle_days,
                "sms_remaining":      plan_init["free_sms_total"] if plan_init["free_sms_total"] > 0 else
                                      plan_init["free_sms_per_day"] * cycle_days,
                "voice_min_remaining":plan_init["free_voice_local_min"],
            }

        for _ in range(n_cdrs):
            evt_start = rand_ts(cs_dt, ce_dt)
            plan_id   = get_plan_on_date(cid, evt_start.date())
            plan      = plan_lookup.get(plan_id, list(plan_lookup.values())[0])

            evt_type = random.choices(
                ["voice","data","sms","roaming"],
                weights=[50, 30, 15, 5]
            )[0]

            if evt_type == "roaming" and not plan["roaming_included"]:
                evt_type = "voice"

            duration_s     = 0
            uplink_bytes   = 0
            downlink_bytes = 0
            sms_count      = 0
            call_type      = None
            direction      = "MO"
            destination    = rand_msisdn()
            inter_op       = False
            net_type       = "5G" if plan["is_5g_plan"] else random.choice(["4G","4G","3G"])
            session_mb     = 0.0

            if evt_type in ("voice", "roaming"):
                duration_s = random.randint(10, 1800)
                call_type  = random.choices(["local","STD","ISD"], weights=[70, 25, 5])[0]
                direction  = random.choices(["MO","MT"], weights=[60, 40])[0]
                inter_op   = random.random() < 0.20
                evt_end    = evt_start + timedelta(seconds=duration_s)

            elif evt_type == "data":
                session_mb     = round(random.uniform(10, 500), 4)
                uplink_bytes   = int(session_mb * 0.2 * 1024 * 1024)
                downlink_bytes = int(session_mb * 0.8 * 1024 * 1024)
                evt_end        = evt_start + timedelta(seconds=random.randint(60, 3600))
                call_type      = "internet"

            elif evt_type == "sms":
                sms_count  = 1
                evt_end    = evt_start + timedelta(seconds=2)
                call_type  = "national"

            roaming_flag = (evt_type == "roaming")

            # ── anomaly injection ──
            record_status = "valid"
            if random.random() < 0.03:
                record_status = "duplicate"
            elif random.random() < 0.02:
                record_status = "invalid"

            # FIX #4: event_date + event_hour
            event_date = evt_start.date()
            event_hour = evt_start.hour

            cdrs.append({
                "cdr_id":                     uid(),
                "customer_id":                cid,
                "msisdn":                     msisdn,
                "imsi":                       "40470" + msisdn[5:],
                "imei":                       str(random.randint(300000000000000, 399999999999999)),
                "event_type":                 evt_type,
                "call_type":                  call_type,
                "direction":                  direction,
                "event_start_time":           evt_start,
                "event_end_time":             evt_end if evt_type != "sms" else evt_start + timedelta(seconds=2),
                "event_date":                 event_date,        # FIX #4
                "event_hour":                 event_hour,        # FIX #4
                "duration_seconds":           duration_s,
                "data_volume_uplink_bytes":   uplink_bytes,
                "data_volume_downlink_bytes": downlink_bytes,
                "sms_count":                  sms_count,
                "destination_number":         destination if evt_type != "data" else None,
                "network_type":               net_type,
                "roaming_flag":               roaming_flag,
                "cell_id":                    random.choice(CELL_IDS),
                "location_area":              c["location_telecom_circle"],
                "switch_id":                  random.choice(SWITCHES),
                "apn":                        "jionet" if evt_type == "data" else None,
                "qos_class":                  random.randint(1, 9) if evt_type == "data" else None,
                "session_id":                 uid() if evt_type == "data" else None,
                "source_system":              random.choice(NETWORK_ELEMENTS),
                "record_status":              record_status,
                "checksum":                   hashlib.md5(f"{cid}{evt_start}".encode()).hexdigest()[:16],
                "inter_operator_flag":        inter_op,
                # internal helpers (dropped before saving)
                "_billing_cycle_id":          cyc_id,
                "_plan_id_at_event":          plan_id,
                "_session_mb":                session_mb,
            })

df_cdr = pd.DataFrame(cdrs)
print(f"  CDR rows: {len(df_cdr)}")

# ─────────────────────────────────────────────
# 7. SMS DETAIL
# ─────────────────────────────────────────────
print("Generating sms_detail...")

sms_cdrs = df_cdr[df_cdr["event_type"] == "sms"].copy()
sms_details = []
for _, row in sms_cdrs.iterrows():
    sms_type = random.choices(["national","premium","international"], weights=[70, 20, 10])[0]
    is_prem  = (sms_type == "premium")
    sms_details.append({
        "sms_detail_id":      uid(),
        "cdr_id":             row["cdr_id"],
        "customer_id":        row["customer_id"],
        "sms_type":           sms_type,
        "destination_msisdn": row["destination_number"] or rand_msisdn(),
        "sms_category":       random.choices(["P2P","A2P","P2A"], weights=[60, 30, 10])[0],
        "is_premium_sms":     is_prem,
        "segment_count":      random.choices([1, 2, 3], weights=[88, 9, 3])[0],
        "delivery_status":    random.choices(["delivered","failed","pending"], weights=[90, 5, 5])[0],
        "operator_charge":    round(random.uniform(1, 5), 2) if is_prem else 0.0,
        "created_at":         row["event_start_time"],
    })

df_sms = pd.DataFrame(sms_details)

# ─────────────────────────────────────────────
# 8. DATA SESSION
#    FIX #3: split usage into normal vs overage correctly
# ─────────────────────────────────────────────
print("Generating data_session...")

data_cdrs_df = df_cdr[df_cdr["event_type"] == "data"].copy()
data_sessions = []

for _, row in data_cdrs_df.iterrows():
    cid     = row["customer_id"]
    cyc_id  = row["_billing_cycle_id"]
    plan_id = row["_plan_id_at_event"]
    plan    = plan_lookup.get(plan_id, list(plan_lookup.values())[0])

    session_mb = row["_session_mb"]

    # FIX #2 + FIX #3: read remaining free data for this cycle
    state_key = (cid, cyc_id)
    remaining_free_mb = free_usage_state.get(state_key, {}).get("data_mb_remaining", 0)

    # FIX #3: split into normal portion and overage
    normal_mb  = min(remaining_free_mb, session_mb)
    overage_mb = max(0.0, session_mb - normal_mb)

    # Decrement remaining
    if state_key in free_usage_state:
        free_usage_state[state_key]["data_mb_remaining"] = max(0, remaining_free_mb - normal_mb)

    cycle_days     = plan_lookup.get(plan_id, {}).get("validity_days", 28)
    if cycle_days < 0: cycle_days = 28
    fup_limit_mb   = plan["daily_data_mb"] * cycle_days if plan["daily_data_mb"] > 0 else 99999999
    cum_used       = (free_usage_state.get(state_key, {}).get("data_mb", fup_limit_mb)
                      - free_usage_state.get(state_key, {}).get("data_mb_remaining", fup_limit_mb))
    fup_triggered  = cum_used > fup_limit_mb
    throttled      = fup_triggered

    ub = row["data_volume_uplink_bytes"]
    db = row["data_volume_downlink_bytes"]

    data_sessions.append({
        "session_detail_id":  uid(),
        "cdr_id":             row["cdr_id"],
        "customer_id":        cid,
        "session_id":         row["session_id"],
        "upload_bytes":       ub,
        "download_bytes":     db,
        "total_bytes":        ub + db,
        "session_mb":         round(session_mb, 4),
        "normal_mb":          round(normal_mb, 4),      # FIX #3: tracked explicitly
        "overage_mb":         round(overage_mb, 4),     # FIX #3: tracked explicitly
        "apn":                "jionet",
        "network_type":       row["network_type"],
        "qos_class":          row["qos_class"],
        "fup_triggered":      fup_triggered,
        "throttled_flag":     throttled,
        "session_start_time": row["event_start_time"],
        "session_end_time":   row["event_end_time"],
        "cell_id":            row["cell_id"],
        "created_at":         row["event_start_time"],
    })

df_datasess = pd.DataFrame(data_sessions)

# ─────────────────────────────────────────────
# 9. BILLING LINE ITEMS  ← FIX #1: NEW TABLE
#    One row per CDR/mediation record with expected_charge
# ─────────────────────────────────────────────
print("Generating billing_line_items (NEW)...")

# Build SMS detail lookup by cdr_id for premium charges
sms_detail_lookup = df_sms.set_index("cdr_id")["operator_charge"].to_dict()
# Build data session lookup by cdr_id for split billing
data_session_lookup = (
    df_datasess.groupby("cdr_id")[["normal_mb","overage_mb"]]
    .sum()
    .to_dict("index")
)

valid_cdrs = df_cdr[df_cdr["record_status"] == "valid"].copy()

line_items = []
for _, row in valid_cdrs.iterrows():
    cid     = row["customer_id"]
    cyc_id  = row["_billing_cycle_id"]
    plan_id = row["_plan_id_at_event"]
    plan    = plan_lookup.get(plan_id, list(plan_lookup.values())[0])
    evt     = row["event_type"]
    cdr_id  = row["cdr_id"]

    expected_charge = 0.0
    free_applied    = 0.0
    rated_units     = 0.0
    rate_used       = 0.0
    charge_type     = evt

    if evt in ("voice", "roaming"):
        dur_min  = row["duration_seconds"] / 60.0
        rated_units = dur_min
        if plan["voice_unlimited_flag"]:
            expected_charge = 0.0
            free_applied    = dur_min
        else:
            # FIX #2: use remaining voice free minutes from per-cycle state
            state_key = (cid, cyc_id)
            rem_voice = free_usage_state.get(state_key, {}).get("voice_min_remaining", 0)
            chargeable_min = max(0, dur_min - rem_voice)
            expected_charge = chargeable_min * (1.5/60 if row["call_type"] == "STD" else 1.0/60)
            free_applied = dur_min - chargeable_min
            if state_key in free_usage_state:
                free_usage_state[state_key]["voice_min_remaining"] = max(0, rem_voice - dur_min)
        charge_type = "voice"
        rate_used = 0.0 if plan["voice_unlimited_flag"] else (1.5/60 if row["call_type"] == "STD" else 1.0/60)

    elif evt == "sms":
        # FIX #2: use per-cycle SMS tracker
        state_key = (cid, cyc_id)
        rem_sms   = free_usage_state.get(state_key, {}).get("sms_remaining", 0)
        sms_units = row["sms_count"]
        rated_units = sms_units
        if rem_sms >= sms_units:
            expected_charge = 0.0
            free_applied    = sms_units
            if state_key in free_usage_state:
                free_usage_state[state_key]["sms_remaining"] -= sms_units
        else:
            chargeable_sms  = sms_units - rem_sms
            expected_charge = chargeable_sms * 1.0
            free_applied    = rem_sms
            if state_key in free_usage_state:
                free_usage_state[state_key]["sms_remaining"] = 0
        # add premium SMS charge if any
        premium_charge  = sms_detail_lookup.get(cdr_id, 0.0)
        expected_charge += premium_charge
        charge_type = "sms"
        rate_used   = 1.0

    elif evt == "data":
        # FIX #3: use pre-computed normal/overage split from data_session
        sess = data_session_lookup.get(cdr_id, {"normal_mb": 0, "overage_mb": 0})
        overage_mb  = sess["overage_mb"]
        rated_units = row["_session_mb"]
        overage_rate = plan["overage_rate_per_gb"] / 1024.0
        expected_charge = overage_mb * overage_rate
        free_applied    = sess["normal_mb"]
        rate_used       = overage_rate
        charge_type     = "data"

    # inter-operator surcharge
    if row["inter_operator_flag"] and evt in ("voice","roaming"):
        expected_charge *= 1.10   # 10% surcharge for inter-op

    tax_amt = round(expected_charge * 0.18, 4)
    line_items.append({
        "line_item_id":        uid(),
        "cdr_id":              cdr_id,
        "customer_id":         cid,
        "billing_cycle_id":    cyc_id,
        "plan_id":             plan_id,
        "event_type":          evt,
        "charge_type":         charge_type,
        "event_date":          row["event_date"],      # FIX #4
        "event_hour":          row["event_hour"],      # FIX #4
        "rated_units":         round(rated_units, 4),
        "rate_applied":        round(rate_used, 6),
        "free_unit_applied":   round(free_applied, 4),
        "expected_charge":     round(expected_charge, 4),
        "tax_amount":          tax_amt,
        "total_expected":      round(expected_charge + tax_amt, 4),
        "is_inter_operator":   row["inter_operator_flag"],
        "created_at":          row["event_start_time"],
    })

df_lineitems = pd.DataFrame(line_items)
print(f"  Billing line items: {len(df_lineitems)}")

# ─────────────────────────────────────────────
# 10. BILLING RECORD
#     FIX #5: store expected_total_charge, actual_total_charge, variance
#     FIX #1: aggregate from billing_line_items
# ─────────────────────────────────────────────
print("Generating billing_record...")

# Aggregate expected charges from line items
li_agg = df_lineitems.groupby(["customer_id","billing_cycle_id"]).agg(
    li_expected_voice  = ("expected_charge", lambda x: df_lineitems.loc[x.index[df_lineitems.loc[x.index,"charge_type"]=="voice"], "expected_charge"].sum()),
    li_expected_data   = ("expected_charge", lambda x: df_lineitems.loc[x.index[df_lineitems.loc[x.index,"charge_type"]=="data"],  "expected_charge"].sum()),
    li_expected_sms    = ("expected_charge", lambda x: df_lineitems.loc[x.index[df_lineitems.loc[x.index,"charge_type"]=="sms"],   "expected_charge"].sum()),
    li_expected_total  = ("total_expected",  "sum"),
).reset_index()

# Simpler reliable aggregation
li_voice = df_lineitems[df_lineitems["charge_type"]=="voice"].groupby(["customer_id","billing_cycle_id"])["expected_charge"].sum().reset_index().rename(columns={"expected_charge":"li_voice"})
li_data  = df_lineitems[df_lineitems["charge_type"]=="data"].groupby(["customer_id","billing_cycle_id"])["expected_charge"].sum().reset_index().rename(columns={"expected_charge":"li_data"})
li_sms   = df_lineitems[df_lineitems["charge_type"]=="sms"].groupby(["customer_id","billing_cycle_id"])["expected_charge"].sum().reset_index().rename(columns={"expected_charge":"li_sms"})
li_total = df_lineitems.groupby(["customer_id","billing_cycle_id"])["total_expected"].sum().reset_index().rename(columns={"total_expected":"li_total"})

li_summary = li_total.copy()
li_summary = li_summary.merge(li_voice, on=["customer_id","billing_cycle_id"], how="left")
li_summary = li_summary.merge(li_data,  on=["customer_id","billing_cycle_id"], how="left")
li_summary = li_summary.merge(li_sms,   on=["customer_id","billing_cycle_id"], how="left")
li_summary = li_summary.fillna(0)

# cust plan map (current)
cust_plan_map = df_cust.set_index("customer_id")["plan_id"].to_dict()

billing_records = []

for _, cyc in df_cycle.iterrows():
    cyc_id = cyc["cycle_id"]
    cid    = cyc["customer_id"]

    plan_id = get_plan_on_date(cid, cyc["cycle_start_date"])
    plan    = plan_lookup.get(plan_id, list(plan_lookup.values())[0])

    cyc_cdrs       = df_cdr[(df_cdr["customer_id"] == cid) & (df_cdr["_billing_cycle_id"] == cyc_id)]
    voice_cdrs_f   = cyc_cdrs[cyc_cdrs["event_type"].isin(["voice","roaming"])]
    data_cdrs_f    = cyc_cdrs[cyc_cdrs["event_type"] == "data"]
    sms_cdrs_f     = cyc_cdrs[cyc_cdrs["event_type"] == "sms"]

    total_voice_min  = voice_cdrs_f["duration_seconds"].sum() / 60.0
    total_data_mb    = (data_cdrs_f["data_volume_uplink_bytes"].sum() +
                        data_cdrs_f["data_volume_downlink_bytes"].sum()) / (1024*1024)
    total_sms        = int(sms_cdrs_f["sms_count"].sum())

    # Get aggregated expected from line items
    li_row = li_summary[(li_summary["customer_id"] == cid) & (li_summary["billing_cycle_id"] == cyc_id)]
    if len(li_row) > 0:
        expected_voice_charge   = float(li_row["li_voice"].values[0])
        expected_data_charge    = float(li_row["li_data"].values[0])
        expected_sms_charge     = float(li_row["li_sms"].values[0])
        expected_event_total    = float(li_row["li_total"].values[0])
    else:
        expected_voice_charge = expected_data_charge = expected_sms_charge = expected_event_total = 0.0

    roaming_flag_any      = bool(cyc_cdrs["roaming_flag"].any())
    expected_roaming_charge = round(random.uniform(20, 200), 2) if roaming_flag_any else 0.0
    expected_total_charge = round(plan["plan_price"] + expected_event_total + expected_roaming_charge, 2)

    # ── ANOMALY INJECTION ──
    anomaly_type   = None
    inject         = random.random()

    actual_voice_charge   = expected_voice_charge
    actual_data_charge    = expected_data_charge
    actual_sms_charge     = expected_sms_charge
    actual_roaming_charge = expected_roaming_charge

    if inject < 0.04:                           # 4% underbilling
        anomaly_type          = "underbilling"
        actual_voice_charge   = 0.0             # wrong: free minutes applied to all calls
    elif inject < 0.06:                         # 2% overbilling
        anomaly_type          = "overbilling"
        actual_voice_charge   = expected_voice_charge * 2.0   # double-charged
    elif inject < 0.08:                         # 2% tariff mismatch
        anomaly_type          = "tariff_mismatch"
        wrong_plan            = plan_lookup.get(random.choice(prepaid_plans), plan)
        cycle_days            = max((cyc["cycle_end_date"] - cyc["cycle_start_date"]).days, 1)
        wrong_free_mb         = wrong_plan["daily_data_mb"] * cycle_days
        actual_data_charge    = max(0, total_data_mb - wrong_free_mb) * (wrong_plan["overage_rate_per_gb"]/1024)
    elif inject < 0.09:                         # 1% missing billing (charge = 0 even though usage exists)
        anomaly_type          = "missing_billing"
        actual_voice_charge   = 0.0
        actual_data_charge    = 0.0
        actual_sms_charge     = 0.0

    # Actual total
    tax_rate    = 18.0
    discount    = round(random.uniform(0, 20), 2)
    actual_base = plan["plan_price"] + actual_voice_charge + actual_data_charge + actual_sms_charge + actual_roaming_charge
    tax_amt     = round(actual_base * tax_rate / 100, 2)
    actual_total_charge = round(actual_base - discount + tax_amt, 2)

    # FIX #5: explicit variance column
    variance = round(expected_total_charge - actual_total_charge, 2)

    bid = uid()
    billing_records.append({
        "billing_id":                bid,
        "customer_id":               cid,
        "plan_id":                   plan_id,
        "billing_cycle_id":          cyc_id,
        "billing_cycle_start":       cyc["cycle_start_date"],
        "billing_cycle_end":         cyc["cycle_end_date"],
        "total_voice_minutes":       round(total_voice_min, 2),
        "total_data_mb":             round(total_data_mb, 2),
        "total_sms_count":           total_sms,
        # Expected (from rating engine)
        "expected_voice_charge":     round(expected_voice_charge, 2),
        "expected_data_charge":      round(expected_data_charge, 2),
        "expected_sms_charge":       round(expected_sms_charge, 2),
        "expected_roaming_charge":   round(expected_roaming_charge, 2),
        "expected_total_charge":     expected_total_charge,
        # Actual (what was billed — may contain anomaly)
        "actual_voice_charge":       round(actual_voice_charge, 2),
        "actual_data_charge":        round(actual_data_charge, 2),
        "actual_sms_charge":         round(actual_sms_charge, 2),
        "actual_roaming_charge":     round(actual_roaming_charge, 2),
        "tax_amount":                tax_amt,
        "discount_amount":           discount,
        "adjustment_amount":         0.0,
        "actual_total_charge":       actual_total_charge,
        # FIX #5: variance
        "variance":                  variance,
        "billing_status":            cyc["billing_status"],
        "bill_generated_at":         datetime.combine(cyc["bill_generation_date"], datetime.min.time()),
        "payment_status":            cyc["payment_status"],
        "payment_date":              cyc["payment_date"],
        # Ground truth label (kept in billing for ground truth CSV)
        "_anomaly_type":             anomaly_type,
        "created_at":                datetime.combine(cyc["bill_generation_date"], datetime.min.time()),
    })

    df_cycle.loc[df_cycle["cycle_id"] == cyc_id, "total_amount"] = actual_total_charge

df_billing = pd.DataFrame(billing_records)
print(f"  Billing records:    {len(df_billing)}")
print(f"  Anomalies injected: {df_billing['_anomaly_type'].notna().sum()}")
print(f"  Anomaly breakdown:\n{df_billing['_anomaly_type'].value_counts(dropna=False).to_string()}")

# ─────────────────────────────────────────────
# SAVE ALL CSVs
# ─────────────────────────────────────────────
print("\nSaving CSVs...")

# Drop internal helper columns
df_cdr_save     = df_cdr.drop(columns=["_billing_cycle_id","_plan_id_at_event","_session_mb"])
df_billing_save = df_billing.drop(columns=["_anomaly_type"])

# Ground truth labels
df_labels = df_billing[["billing_id","customer_id","_anomaly_type"]].rename(
    columns={"_anomaly_type": "anomaly_type"})
df_labels["anomaly_flag"]     = df_labels["anomaly_type"].notna().astype(int)
df_labels["is_underbilling"]  = (df_labels["anomaly_type"] == "underbilling").astype(int)
df_labels["is_overbilling"]   = (df_labels["anomaly_type"] == "overbilling").astype(int)
df_labels["is_tariff_mismatch"] = (df_labels["anomaly_type"] == "tariff_mismatch").astype(int)
df_labels["is_missing_billing"] = (df_labels["anomaly_type"] == "missing_billing").astype(int)

saves = {
    "01_customer":              df_cust,
    "02_tariff_plan":           df_plan,
    "03_tariff_rate":           df_rate,
    "04_customer_plan_history": df_planhist,
    "05_billing_cycle":         df_cycle,
    "06_cdr":                   df_cdr_save,
    "07_sms_detail":            df_sms,
    "08_data_session":          df_datasess,
    "09_billing_line_items":    df_lineitems,    # FIX #1: new table
    "10_billing_record":        df_billing_save,
    "11_anomaly_ground_truth":  df_labels,
}

print(f"\n{'Table':<35} {'Rows':>8}  {'Cols':>5}")
print("─" * 55)
for fname, df in saves.items():
    path = f"{OUTPUT_DIR}/{fname}.csv"
    df.to_csv(path, index=False)
    print(f"  {fname:<33} {len(df):>8,}  {df.shape[1]:>5}")

print("\n✅ Dataset generation complete.")
print(f"   Output folder: {OUTPUT_DIR}")
print("\n── Fix checklist ──")
print("  ✅ FIX 1: billing_line_items table added (event-level expected_charge)")
print("  ✅ FIX 2: Free usage tracked per (customer_id, billing_cycle_id)")
print("  ✅ FIX 3: Data split into normal_mb + overage_mb")
print("  ✅ FIX 4: event_date + event_hour added to CDR + line_items")
print("  ✅ FIX 5: expected_total_charge, actual_total_charge, variance in billing_record")
print("  ✅ FIX 6: random.seed(42) + np.random.seed(42)")